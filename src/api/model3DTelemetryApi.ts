import type {
  ThreeDIdentity,
  ThreeDTechnicalEvent,
} from "@/types/model3DTelemetryTypes";

type PendingVisit = {
  attemptID: string;
  identity: ThreeDIdentity;
  events: ThreeDTechnicalEvent[];
  nextAt: number;
  failures: number;
  batchLimit: number;
  blocked: boolean;
};

const pending = new Map<string, PendingVisit>();
const encoder = new TextEncoder();

let timer: ReturnType<typeof setTimeout> | undefined;
let sending = false;
let nextDispatchAt = 0;

function schedule() {
  if (sending) return;
  clearTimeout(timer);

  const ready = [...pending.values()].filter(
    (entry) =>
      !entry.blocked &&
      entry.failures < 8 &&
      entry.events.length > 0
  );

  if (!ready.length) return;

  const due = Math.max(
    nextDispatchAt,
    Math.min(...ready.map((entry) => entry.nextAt))
  );

  timer = setTimeout(
    () => void pump(),
    Math.max(0, due - Date.now())
  );
}

function retry(entry: PendingVisit, retryAfterMs = 0) {
  entry.failures++;

  entry.nextAt =
    Date.now() +
    Math.max(
      retryAfterMs,
      Math.min(60_000, 2_000 * 2 ** (entry.failures - 1)) +
        Math.random() * 1_000
    );

  if (entry.failures >= 8) {
    console.warn(
      "3D telemetry retries paused; events retained.",
      entry.attemptID
    );
  }
}

function retryAfter(value: string | null) {
  if (!value) return 0;

  const seconds = Number(value);

  return Number.isFinite(seconds)
    ? Math.max(0, seconds * 1000)
    : Math.max(0, Date.parse(value) - Date.now()) || 0;
}

async function pump() {
  if (sending) return;

  const now = Date.now();

  const entry = [...pending.values()]
    .filter(
      (item) =>
        !item.blocked &&
        item.failures < 8 &&
        item.nextAt <= now
    )
    .sort((a, b) => a.nextAt - b.nextAt)[0];

  if (!entry || now < nextDispatchAt) {
    schedule();
    return;
  }

  const batch = entry.events.slice(0, entry.batchLimit);

  let body = JSON.stringify({
    ...entry.identity,
    events: batch,
  });

  while (
    batch.length > 1 &&
    encoder.encode(body).byteLength > 60_000
  ) {
    batch.pop();

    body = JSON.stringify({
      ...entry.identity,
      events: batch,
    });
  }

  if (
    !batch.length ||
    encoder.encode(body).byteLength > 60_000
  ) {
    entry.blocked = true;

    console.error(
      "3D telemetry payload requires correction.",
      entry.attemptID
    );

    schedule();
    return;
  }

  sending = true;

  // At most one telemetry request every three seconds.
  nextDispatchAt = now + 3_000;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const base = String(import.meta.env.VITE_BASE_URL).replace(
      /\/+$/,
      ""
    );

    const response = await fetch(
      base +
        "/q/3d/view-attempts/" +
        encodeURIComponent(entry.attemptID) +
        "/events",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body,
        signal: controller.signal,
        keepalive: true,
      }
    );

    const result = (await response.json().catch(() => ({}))) as {
      attemptID?: string;
      acceptedEventIDs?: string[];
      duplicateEventIDs?: string[];
      code?: string;
    };

    if (!response.ok) {
      if (response.status === 413 && batch.length > 1) {
        entry.batchLimit = Math.max(
          1,
          Math.floor(batch.length / 2)
        );

        entry.nextAt = Date.now() + 3_000;
        return;
      }

      const canRetry =
        response.status >= 500 ||
        response.status === 408 ||
        response.status === 429 ||
        (response.status === 409 &&
          result.code === "MODEL3D_ATTEMPT_UNAVAILABLE");

      if (canRetry) {
        const wait = retryAfter(
          response.headers.get("Retry-After")
        );

        if (response.status === 429) {
          nextDispatchAt = Math.max(
            nextDispatchAt,
            Date.now() + Math.max(wait, 60_000)
          );
        }

        retry(entry, wait);
      } else {
        entry.blocked = true;

        console.error(
          "3D telemetry request rejected; events retained.",
          {
            attemptID: entry.attemptID,
            status: response.status,
            code: result.code,
          }
        );
      }

      return;
    }

    if (
      result.attemptID !== entry.attemptID ||
      !Array.isArray(result.acceptedEventIDs) ||
      !Array.isArray(result.duplicateEventIDs)
    ) {
      throw new Error("Invalid 3D telemetry acknowledgement");
    }

    const sentIDs = new Set(
      batch.map((event) => event.eventID)
    );

    const acknowledged = new Set(
      [
        ...result.acceptedEventIDs,
        ...result.duplicateEventIDs,
      ].filter((id) => sentIDs.has(id))
    );

    if (!acknowledged.size) {
      throw new Error("No 3D events acknowledged");
    }

    entry.events = entry.events.filter(
      (event) => !acknowledged.has(event.eventID)
    );

    entry.failures = 0;
    entry.nextAt = Date.now() + 3_000;

    if (!entry.events.length) {
      pending.delete(entry.attemptID);
    }
  } catch {
    retry(entry);
  } finally {
    clearTimeout(timeout);
    sending = false;
    schedule();
  }
}

export function enqueue3DEvent(
  attemptID: string,
  identity: ThreeDIdentity,
  event: ThreeDTechnicalEvent
) {
  let entry = pending.get(attemptID);

  if (!entry) {
    entry = {
      attemptID,
      identity: { ...identity },
      events: [],
      nextAt: Date.now() + 750,
      failures: 0,
      batchLimit: 50,
      blocked: false,
    };

    pending.set(attemptID, entry);
  }

  entry.events.push(event);
  schedule();
}

export function retryPending3DTelemetry() {
  for (const entry of pending.values()) {
    if (!entry.blocked) {
      entry.failures = 0;
      entry.nextAt = Date.now();
    }
  }

  schedule();
}

window.addEventListener("online", retryPending3DTelemetry);