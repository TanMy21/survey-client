import type {
  PersistedResponseMap,
  ResponseRegistry,
  ResponseRegistryProviderProps,
  ResponseState,
} from "@/types/responseTypes";
import { createContext, useContext, useMemo, useRef } from "react";

const ResponseRegistryContext = createContext<ResponseRegistry | null>(null);

export const ResponseRegistryProvider: React.FC<ResponseRegistryProviderProps> = ({
  children,
  initial,
  persistedResponses = [],
}) => {
  const responseStateRef = useRef<Record<string, ResponseState>>(initial ?? {});

  const realTimeResponseRef = useRef<Record<string, { value: any; optionID: string | null }>>({});

  const persistedMap: PersistedResponseMap = useMemo(() => {
    const map: PersistedResponseMap = {};
    for (const r of persistedResponses) {
      map[r.relatedQuestionID] = {
        value: r.response,
        optionID: r.relatedOptionID,
      };
    }
    return map;
  }, [persistedResponses]);

  // Registry API
  const api = useMemo<ResponseRegistry>(
    () => ({
      getState: (qid) => responseStateRef.current[qid] ?? "UNTOUCHED",

      // first interaction (click / type / drag)
      markTouched: (qid) => {
        if (!responseStateRef.current[qid]) {
          responseStateRef.current[qid] = "TOUCHED";
        }
      },

      // intent confirmed (BEFORE async submit)
      markAnswered: (qid) => {
        responseStateRef.current[qid] = "ANSWERED";
      },

      // skip interceptor only
      markSkipped: (qid) => {
        responseStateRef.current[qid] = "SKIPPED";
      },

      isResponse: (qid) => responseStateRef.current[qid] === "ANSWERED",

      // legacy setter mapped onto new state model
      setResponse: (qid, v) => {
        responseStateRef.current[qid] = v ? "ANSWERED" : "UNTOUCHED";
      },

      setRealTimeResponse: (qid, value, optionID = null) => {
        realTimeResponseRef.current[qid] = { value, optionID };
        responseStateRef.current[qid] = "ANSWERED";
      },

      // read real time response used for hydration on navigation back
      getRealTimeResponse: (qid) => {
        return realTimeResponseRef.current[qid] ?? null;
      },

      persistedResponses: persistedMap,
    }),
    [persistedMap]
  );

  return (
    <ResponseRegistryContext.Provider value={api}>{children}</ResponseRegistryContext.Provider>
  );
};

export const useResponseRegistry = () => {
  const ctx = useContext(ResponseRegistryContext);
  if (!ctx) throw new Error("useResponseRegistry must be used within ResponseRegistryProvider");
  return ctx;
};
