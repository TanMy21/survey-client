import type { ActiveSessionArgs, PauseSessionArgs, Session, SessionArgs } from "@/types/sessionTypes";

const inFlightSessionCreations = new Map<string, Promise<Session>>();

const createSessionRequest = async ({ shareID, deviceID, meta }: SessionArgs) => {
  try {
    const sessionCreated = await fetch(`${import.meta.env.VITE_BASE_URL}/ses/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shareID, deviceID, meta }),
    });

    if (!sessionCreated.ok) {
      const text = await sessionCreated.text().catch(() => "");
      throw new Error(text || `Failed to create session (${sessionCreated.status})`);
    }

    return sessionCreated.json();
  } catch (error) {
    console.error("Error creating session: ", error);
    throw error;
  }
};

export const createSession = (args: SessionArgs) => {
  const key = JSON.stringify([args.shareID, args.deviceID]);
  const existingRequest = inFlightSessionCreations.get(key);

  if (existingRequest) return existingRequest;

  const request = createSessionRequest(args).finally(() => {
    if (inFlightSessionCreations.get(key) === request) {
      inFlightSessionCreations.delete(key);
    }
  });

  inFlightSessionCreations.set(key, request);
  return request;
};

export const completeSession = async ({ surveyID, deviceID, shareID }: SessionArgs) => {
  try {
    const sessionCompleted = await fetch(`${import.meta.env.VITE_BASE_URL}/ses/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ surveyID, deviceID, shareID }),
    });

    if (!sessionCompleted.ok) {
      const text = await sessionCompleted.text().catch(() => "");
      throw new Error(text || `Failed to complete session (${sessionCompleted.status})`);
    }

    return true;
  } catch (error) {
    console.error("Error completing session: ", error);
    throw error;
  }
};

export async function pauseSession({ surveyID, deviceID, currentQuestionID }: PauseSessionArgs) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/ses/pause`, {
      method: "POST",
      keepalive: true, // for tab close
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyID, deviceID, currentQuestionID }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || `Failed to pause session (${response.status})`);
    }
  } catch (e) {
    console.warn("pauseSession failed:", e);
  }
}

export async function markActiveApi({
  surveyID,
  deviceID,
  currentQuestionID,
}: ActiveSessionArgs) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/ses/active`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ surveyID, deviceID, currentQuestionID }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Failed to mark session active (${response.status})`);
  }
}
