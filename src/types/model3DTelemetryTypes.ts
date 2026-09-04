export type ThreeDEventType =
  | "LOAD_STARTED"
  | "MODEL_LOADED"
  | "FIRST_RENDER"
  | "CONTEXT_LOST"
  | "CONTEXT_RESTORED"
  | "RENDER_RESUMED"
  | "RETRY_STARTED"
  | "ERROR";

export type ThreeDErrorCode =
  | "MODEL_URL_MISSING"
  | "MODEL_URL_INVALID"
  | "ASSET_HTTP_ERROR"
  | "ASSET_FETCH_FAILED"
  | "LOAD_TIMEOUT"
  | "MODEL_PARSE_FAILED"
  | "MODEL_FEATURE_UNSUPPORTED"
  | "DECODER_FAILED"
  | "TEXTURE_LOAD_FAILED"
  | "ENVIRONMENT_LOAD_FAILED"
  | "WEBGL_UNAVAILABLE"
  | "WEBGL_CONTEXT_LOST"
  | "SHADER_ERROR"
  | "RENDERER_ERROR"
  | "VIEWER_RUNTIME_ERROR"
  | "UNKNOWN_ERROR";

export type ThreeDIdentity = {
  sessionID: string;
  questionID: string;
  deviceID: string;
  model3DID: string;
};

export type ThreeDDiagnostic = {
  errorCode: ThreeDErrorCode;
  stage?: "LOAD" | "PARSE" | "RENDERER_INIT" | "RENDER";
  assetType?: "MODEL" | "TEXTURE" | "ENVIRONMENT" | "DECODER";
  message?: string;
  httpStatus?: number;
};

export type ThreeDTechnicalEvent = Partial<ThreeDDiagnostic> & {
  eventID: string;
  type: ThreeDEventType;
  occurredAt: string;
  attemptNumber: number;
};