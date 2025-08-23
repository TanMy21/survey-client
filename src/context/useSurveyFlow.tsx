import type { FlowContextType } from "@/types/surveyTypes";
import { createContext, useContext, useState } from "react";

const SurveyFlowContext = createContext<FlowContextType>({
  canProceed: false,
  setCanProceed: () => {},
});

export const useSurveyFlow = () => useContext(SurveyFlowContext);

export const SurveyFlowProvider = ({ children }: { children: React.ReactNode }) => {
  const [canProceed, setCanProceed] = useState(false);

  return (
    <SurveyFlowContext.Provider value={{ canProceed, setCanProceed }}>
      {children}
    </SurveyFlowContext.Provider>
  );
};
