import SurveyContainer from "@/components/SurveyContainer";
import { useParams } from "react-router";

const Survey = () => {
  const { surveyID } = useParams<{ surveyID: string }>();
  if (!surveyID) return null;
  return (
    <div className="w-screen h-screen bg-white">
      <SurveyContainer surveyID={surveyID} />
    </div>
  );
};

export default Survey;
