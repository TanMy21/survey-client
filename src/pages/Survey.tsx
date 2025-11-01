import SurveyContainer from "@/components/SurveyContainer";
import { SessionProvider } from "@/context/useSessionContext";
import { SurveyFlowProvider } from "@/context/useSurveyFlow";
import { useParams } from "react-router";

const Survey = () => {
  const { shareID } = useParams<{ shareID: string }>();
  if (!shareID) return null;
  return (
    <div className="h-screen w-screen bg-white">
      <SessionProvider>
        <SurveyFlowProvider>
          <SurveyContainer shareID={shareID} />
        </SurveyFlowProvider>
      </SessionProvider>
    </div>
  );
};

export default Survey;
