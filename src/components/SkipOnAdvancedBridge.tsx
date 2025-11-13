import { useSkipOnAdvance } from "@/hooks/useSkipOnAdvanced";

const SkipOnAdvanceBridge = ({ surveyID }: { surveyID: string }) => {
  useSkipOnAdvance(surveyID);  
  return null;
};
export default SkipOnAdvanceBridge;