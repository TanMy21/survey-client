import { FlowRuntimeProvider } from "@/context/FlowRuntimeProvider";
import type { SurveyContainerProps } from "@/types/surveyTypes";
import SurveyScreenLayout from "./SurveyScreenLayout";
import { useFetchSurvey } from "@/hooks/useSurvey";
import { useMemo } from "react";
import { LogoLoader } from "./loader/LogoLoader";

const SurveyContainer = ({ surveyID }: SurveyContainerProps) => {
  const { data, isLoading, isError } = useFetchSurvey(surveyID);

  // Build payload only when data is ready
  const payload = useMemo(() => {
    if (!data) return null;
    return {
      surveyID,
      questions: data.questions, // as-is from backend
      FlowCondition: data.FlowCondition, // as-is from backend
    };
  }, [data, surveyID]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <LogoLoader />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-white p-4 text-center">
        <h1 className="text-xl text-red-500">Error loading survey. Please try again.</h1>
      </div>
    );
  }

  return (
    <FlowRuntimeProvider payload={payload!}>
      <SurveyScreenLayout surveyID={surveyID} />
    </FlowRuntimeProvider>
  );
};

export default SurveyContainer;
