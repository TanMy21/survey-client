import { FlowRuntimeProvider } from "@/context/FlowRuntimeProvider";
import type { SurveyContainerProps } from "@/types/surveyTypes";
import SurveyScreenLayout from "./SurveyScreenLayout";
import { useFetchSurvey } from "@/hooks/useSurvey";
import { useMemo } from "react";
import { LogoLoader } from "./loader/LogoLoader";

const SurveyContainer = ({ surveyID }: SurveyContainerProps) => {
  const { data, isLoading, isError } = useFetchSurvey(surveyID);

  const payload = useMemo(() => {
    if (!data) return null;

    const base = [...(data.questions ?? [])];

    const consentScreen = {
      questionID: "consent-screen",
      type: "CONSENT",
      order: -2,
    } as any;

    const welcomeIdx = base.findIndex((q) => q.type === "WELCOME_SCREEN");
    if (welcomeIdx >= 0) {
      const welcomeOrder = base[welcomeIdx].order ?? 0;
      consentScreen.order = welcomeOrder + 0.5;
      base.push(consentScreen);
    } else {
      consentScreen.order = -1e6;
      base.push(consentScreen);
    }

    const questionsWithInjectedConsentScreen = base.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return {
      surveyID,
      questions: questionsWithInjectedConsentScreen,
      FlowCondition: data.FlowCondition,
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
