import { useResponseRegistry } from "@/context/ResponseRegistry";
import type { HydrateOptions } from "@/types/responseTypes";
import { useEffect, useState } from "react";
 


export function useHydratedResponse<T>({
  question,
  mapPersisted,
  defaultValue,
}: HydrateOptions<T>) {
  const { persistedResponses, setResponse } = useResponseRegistry();

  const [value, setValue] = useState<T | null>(defaultValue ?? null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persisted = persistedResponses[question.questionID];

    if (!persisted) return;

    let mapped: T;

    if (mapPersisted) mapped = mapPersisted(persisted);
    else mapped = persisted.value as T;

    setValue(mapped);
    setResponse(question.questionID, true);
    setHydrated(true);
  }, [persistedResponses, question.questionID, setResponse]);

  const clearHydration = () => setHydrated(false);

  return { value, setValue, hydrated, clearHydration };
}
