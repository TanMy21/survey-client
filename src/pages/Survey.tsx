import SurveyContainer from "@/components/SurveyContainer";
import { SurveyFlowProvider } from "@/context/useSurveyFlow";
import { useParams } from "react-router";

const Survey = () => {
  const { shareID } = useParams<{ shareID: string }>();
  if (!shareID) return null;
  return (
    <div className="h-screen w-screen bg-white">
      <SurveyFlowProvider>
        <SurveyContainer surveyID={shareID} />
      </SurveyFlowProvider>
    </div>
  );
};

export default Survey;
