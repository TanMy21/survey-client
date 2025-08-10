import { useBehaviorTracker } from "@/hooks/useBehaviorTracker";
import { createContext, useContext } from "react";

const BehaviorTrackerContext = createContext<ReturnType<typeof useBehaviorTracker> | null>(null);

export const useBehavior = () => {
  const ctx = useContext(BehaviorTrackerContext);
  if (!ctx) throw new Error("BehaviorTrackerContext not found");
  return ctx;
};

export const BehaviorTrackerProvider = ({
  questionID,
  questionType,
  children,
  backtrackCountMapRef,
}: {
  questionID: string;
  questionType: string;
  children: React.ReactNode;
  backtrackCountMapRef: React.RefObject<Map<string, number>>;
}) => {
  const tracker = useBehaviorTracker(questionID, questionType, backtrackCountMapRef);
  return (
    <BehaviorTrackerContext.Provider value={tracker}>{children}</BehaviorTrackerContext.Provider>
  );
};
