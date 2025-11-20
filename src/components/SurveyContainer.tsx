import { FlowRuntimeProvider } from "@/context/FlowRuntimeProvider";
import type { SurveyContainerProps } from "@/types/surveyTypes";
import SurveyScreenLayout from "./SurveyScreenLayout";
import { useFetchSurvey } from "@/hooks/useSurvey";
import { useEffect, useMemo, useRef } from "react";
import { LogoLoader } from "./loader/LogoLoader";
import { useCreateSession } from "@/hooks/useSession";
import { useSession } from "@/context/useSessionContext";
import { getOrCreateDeviceId } from "@/utils/deviceID";
import { buildParticipantMeta } from "@/utils/fingerprint";
import { ResponseRegistryProvider } from "@/context/ResponseRegistry";
import type { Session } from "@/types/sessionTypes";

const SurveyContainer = ({ shareID }: SurveyContainerProps) => {
  const deviceID = getOrCreateDeviceId();
  const meta = buildParticipantMeta();
  const { setSession } = useSession();

  const {
    mutateAsync: createSession,
    data: session,
    isIdle,
    isPending: sessionPending,
    isSuccess: sessionReady,
  } = useCreateSession({
    onSuccess: (session: Session) => {
      setSession(session);
    },
  });

  useEffect(() => {
    if (!isIdle) return; // mutation already triggered or completed
    createSession({ shareID: shareID!, deviceID, meta });
  }, [isIdle, createSession, shareID, deviceID, meta]);

  const {
    data: survey,
    isLoading: surveyLoading,
    isError: surveyError,
  } = useFetchSurvey(shareID!, deviceID,{
    enabled: sessionReady,
  });

  // const createSessionOnceRef = useRef(false);

  // const payload = useMemo(() => {
  //   if (!data) return null;

  //   const base = [...(data.questions ?? [])];

  //   const consentScreen = {
  //     questionID: "consent-screen",
  //     type: "CONSENT",
  //     order: -2,
  //   } as any;

  //   const welcomeIdx = base.findIndex((q) => q.type === "WELCOME_SCREEN");
  //   if (welcomeIdx >= 0) {
  //     const welcomeOrder = base[welcomeIdx].order ?? 0;
  //     consentScreen.order = welcomeOrder + 0.5;
  //     base.push(consentScreen);
  //   } else {
  //     consentScreen.order = -1e6;
  //     base.push(consentScreen);
  //   }

  //   const questionsWithInjectedConsentScreen = base.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  //   return {
  //     shareID,
  //     questions: questionsWithInjectedConsentScreen,
  //     FlowCondition: data.FlowCondition,
  //   };
  // }, [data, shareID]);

  if (surveyLoading || sessionPending || !session) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <LogoLoader />
      </div>
    );
  }

  if (surveyError || !survey) {
    return (
      <div className="flex h-screen items-center justify-center bg-white p-4 text-center">
        <h1 className="text-xl text-red-500">Error loading survey. Please try again.</h1>
      </div>
    );
  }

  console.log("Survey loaded:", survey);

  return (
    <FlowRuntimeProvider payload={survey!}>
      <ResponseRegistryProvider>
        <SurveyScreenLayout surveyID={survey.surveyID} shareID={shareID} />
      </ResponseRegistryProvider>
    </FlowRuntimeProvider>
  );
};

export default SurveyContainer;
