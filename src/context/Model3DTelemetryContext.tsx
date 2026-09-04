import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import { enqueue3DEvent } from "@/api/model3DTelemetryApi";
import type {
  ThreeDDiagnostic,
  ThreeDEventType,
  ThreeDIdentity,
} from "@/types/model3DTelemetryTypes";

class Model3DVisit {
  readonly attemptID = crypto.randomUUID();
  readonly identity: ThreeDIdentity | null;

  attemptNumber = 1;
  loaded = false;
  environmentLoaded = false;
  hasError = false;

  private rendered = false;
  private lost = false;
  private resumePending = false;
  private emitted = new Set<string>();

  constructor(identity: ThreeDIdentity | null) {
    this.identity = identity ? { ...identity } : null;
  }

  private emit(
    type: ThreeDEventType,
    diagnostic?: ThreeDDiagnostic
  ) {
    if (!this.identity) return;

    enqueue3DEvent(this.attemptID, this.identity, {
      eventID: crypto.randomUUID(),
      type,
      occurredAt: new Date().toISOString(),
      attemptNumber: this.attemptNumber,
      ...diagnostic,
    });
  }

  private once(
    key: string,
    type: ThreeDEventType,
    diagnostic?: ThreeDDiagnostic
  ) {
    if (this.emitted.has(key)) return;

    this.emitted.add(key);
    this.emit(type, diagnostic);
  }

  start(number: number) {
    if (number === this.attemptNumber) {
      this.once("load", "LOAD_STARTED");
    }
  }

  modelLoaded(number: number) {
    if (number !== this.attemptNumber) return;

    this.loaded = true;
    this.once("loaded", "MODEL_LOADED");
  }

  environmentReady(number: number) {
    if (number === this.attemptNumber) {
      this.environmentLoaded = true;
    }
  }

  error(number: number, diagnostic: ThreeDDiagnostic) {
    if (number !== this.attemptNumber) return;

    this.hasError = true;

    if (diagnostic.stage === "RENDER" && this.rendered) {
      this.resumePending = true;
    }

    const cleaned = {
      ...diagnostic,
      ...(diagnostic.message
        ? {
            message: diagnostic.message
              .replace(
                /https?:\/\/[^\s"'<>]+/g,
                (url) => url.split(/[?#]/)[0]
              )
              .slice(0, 2_000),
          }
        : {}),
    };

    this.once(
      "error:" + JSON.stringify(cleaned),
      "ERROR",
      cleaned
    );
  }

  contextLost(number: number) {
    if (number !== this.attemptNumber || this.lost) return;

    this.lost = true;
    this.resumePending = this.rendered;

    this.emit("CONTEXT_LOST");

    this.error(number, {
      errorCode: "WEBGL_CONTEXT_LOST",
      stage: "RENDER",
      message: "The browser reported WebGL context loss.",
    });
  }

  contextRestored(number: number) {
    if (number !== this.attemptNumber || !this.lost) return;

    this.lost = false;
    this.emit("CONTEXT_RESTORED");
  }

  frameRendered(number: number) {
    if (number !== this.attemptNumber || this.lost) {
      return false;
    }

    const assetsReady =
      this.loaded && this.environmentLoaded;

    const changed =
      !this.rendered ||
      this.resumePending ||
      (this.hasError && assetsReady);

    if (!this.rendered) {
      this.rendered = true;
      this.once("rendered", "FIRST_RENDER");
    } else if (this.resumePending) {
      this.emit("RENDER_RESUMED");
    }

    this.resumePending = false;

    if (assetsReady) {
      this.hasError = false;
    }

    return changed;
  }

  retry() {
    this.attemptNumber++;

    this.loaded = false;
    this.environmentLoaded = false;
    this.hasError = false;
    this.rendered = false;
    this.lost = false;
    this.resumePending = false;

    this.emitted.clear();
    this.emit("RETRY_STARTED");

    return this.attemptNumber;
  }
}

type ContextValue = {
  visit: Model3DVisit;
  attemptNumber: number;
  retry: () => void;
};

const Context = createContext<ContextValue | null>(null);

export function Model3DTelemetryProvider({
  identity,
  children,
}: {
  identity: ThreeDIdentity | null;
  children: ReactNode;
}) {
  const [visit] = useState(
    () => new Model3DVisit(identity)
  );

  const [attemptNumber, setAttemptNumber] = useState(1);

  return (
    <Context.Provider
      value={{
        visit,
        attemptNumber,
        retry: () => setAttemptNumber(visit.retry()),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useModel3DTelemetry() {
  const value = useContext(Context);

  if (!value) {
    throw new Error("Model3DTelemetryProvider is missing");
  }

  return value;
}