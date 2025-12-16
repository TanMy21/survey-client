import { useResponseRegistry } from "@/context/ResponseRegistry";
import type { HydrateOptions } from "@/types/responseTypes";
import { useCallback, useEffect, useRef, useState } from "react";

export function useHydratedResponse<T>({
  question,
  mapPersisted,
  defaultValue,
}: HydrateOptions<T>) {
  const { persistedResponses, getRealTimeResponse } = useResponseRegistry();
  const questionID = question.questionID;

  const realTimeResponse = getRealTimeResponse(questionID);
  const persisted = realTimeResponse ?? persistedResponses[questionID];

  const dirtyRef = useRef(false);

  const [value, _setValue] = useState<T>(() => {
    if (persisted) return mapPersisted(persisted);
    return defaultValue as T;
  });
  const [hydrated, setHydrated] = useState<boolean>(() => !!persisted);

  /**
   * HARD RE-HYDRATE on question activation
   */
  useEffect(() => {
    dirtyRef.current = false;

    if (persisted) {
      _setValue(mapPersisted(persisted));
      setHydrated(true);
    } else if (defaultValue !== undefined) {
      _setValue(defaultValue);
      setHydrated(false);
    }
  }, [questionID, , persistedResponses[questionID]]); 

  /**
   * Optional: handle late-arriving persisted responses
   */
  useEffect(() => {
    if (!persisted) return;
    if (dirtyRef.current) return;

    _setValue(mapPersisted(persisted));
    setHydrated(true);
  }, [persisted, mapPersisted]);

  /**
   * User-driven updates
   */
  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback((next) => {
    dirtyRef.current = true;
    setHydrated(false);

    _setValue((prev) => (typeof next === "function" ? (next as (p: T) => T)(prev) : next));
  }, []);

  const clearHydration = useCallback(() => {
    dirtyRef.current = true;
    setHydrated(false);
  }, []);

  return { value, setValue, hydrated, clearHydration };
}
