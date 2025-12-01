import type {
  PersistedResponseMap,
  ResponseRegistry,
  ResponseRegistryProviderProps,
} from "@/types/responseTypes";
import { createContext, useContext, useMemo, useRef } from "react";

const ResponseRegistryContext = createContext<ResponseRegistry | null>(null);

export const ResponseRegistryProvider: React.FC<ResponseRegistryProviderProps> = ({
  children,
  initial,
  persistedResponses = [],
}) => {
  const answeredRef = useRef<Record<string, boolean>>(initial ?? {});

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
      isResponse: (qid) => !!answeredRef.current[qid],

      setResponse: (qid, v) => {
        answeredRef.current[qid] = v;
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
