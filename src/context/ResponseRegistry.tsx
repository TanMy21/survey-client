import type { ResponseRegistry, ResponseRegistryProviderProps } from "@/types/responseTypes";
import { createContext, useContext, useMemo, useRef } from "react";

const ResponseRegistryContext = createContext<ResponseRegistry | null>(null);

export const ResponseRegistryProvider: React.FC<ResponseRegistryProviderProps> = ({
  children,
  initial,
}) => {
  const ref = useRef<Record<string, boolean>>(initial ?? {});

  const api = useMemo<ResponseRegistry>(
    () => ({
      isResponse: (qid) => !!ref.current[qid],
      setResponse: (qid, v) => {
        ref.current[qid] = v;
      },
    }),
    []
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
