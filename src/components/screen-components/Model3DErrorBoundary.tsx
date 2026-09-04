import { Component } from "react";
import type { ReactNode } from "react";

import type { ThreeDDiagnostic } from "@/types/model3DTelemetryTypes";

export function classify3DError(
  error: unknown,
  scope: "MODEL" | "ENVIRONMENT" | "VIEWER"
): ThreeDDiagnostic {
  const message =
    error instanceof Error ? error.message : String(error);

  const http = message.match(
    /responded with\s+([45]\d{2})\b/i
  );

  const assetType =
    scope === "ENVIRONMENT" ? "ENVIRONMENT" : "MODEL";

  if (http) {
    return {
      errorCode: "ASSET_HTTP_ERROR",
      stage: "LOAD",
      ...(scope === "ENVIRONMENT"
        ? { assetType: "ENVIRONMENT" as const }
        : {}),
      httpStatus: Number(http[1]),
      message,
    };
  }

  if (/DRACOLoader|MeshoptDecoder|KTX2Loader/.test(message)) {
    return {
      errorCode: "DECODER_FAILED",
      stage: "PARSE",
      assetType: "DECODER",
      message,
    };
  }

  if (
    /couldn't load texture|failed to load texture/i.test(
      message
    )
  ) {
    return {
      errorCode: "TEXTURE_LOAD_FAILED",
      stage: "LOAD",
      assetType: "TEXTURE",
      message,
    };
  }

  if (
    /unsupported asset|unsupported required extension/i.test(
      message
    )
  ) {
    return {
      errorCode: "MODEL_FEATURE_UNSUPPORTED",
      stage: "PARSE",
      assetType: "MODEL",
      message,
    };
  }

  if (
    /JSON\.parse|not valid JSON|Unexpected token.*JSON|Invalid glTF/i.test(
      message
    )
  ) {
    return {
      errorCode: "MODEL_PARSE_FAILED",
      stage: "PARSE",
      assetType: "MODEL",
      message,
    };
  }

  if (scope === "ENVIRONMENT") {
    return {
      errorCode: "ENVIRONMENT_LOAD_FAILED",
      stage: "LOAD",
      assetType,
      message,
    };
  }

  if (
    /failed to fetch|networkerror|network request failed/i.test(
      message
    )
  ) {
    return {
      errorCode: "ASSET_FETCH_FAILED",
      stage: "LOAD",
      message,
    };
  }

  return {
    errorCode:
      scope === "VIEWER"
        ? "VIEWER_RUNTIME_ERROR"
        : "UNKNOWN_ERROR",
    message,
  };
}

type Props = {
  children: ReactNode;
  onError: (error: Error) => void;
  fallback?: ReactNode;
};

export class Model3DErrorBoundary extends Component<
  Props,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    return this.state.failed
      ? this.props.fallback ?? null
      : this.props.children;
  }
}