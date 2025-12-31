import { FlowRuntimeProvider } from "@/context/FlowRuntimeProvider";
import type { SurveyContainerProps } from "@/types/surveyTypes";
import SurveyScreenLayout from "./SurveyScreenLayout";
import { useFetchSurvey } from "@/hooks/useSurvey";
import { useEffect } from "react";
import { LogoLoader } from "./loader/LogoLoader";
import { useCreateSession } from "@/hooks/useSession";
import { useSession } from "@/context/useSessionContext";
import { getOrCreateDeviceId } from "@/utils/deviceID";
import { buildParticipantMeta } from "@/utils/fingerprint";
import { ResponseRegistryProvider } from "@/context/ResponseRegistry";

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
  } = useCreateSession();
  //   {
  //   onSuccess: (session: Session) => {
  //     setSession(session);
  //   },
  // }

  useEffect(() => {
    if (!isIdle) return; // mutation already triggered or completed
    createSession({ shareID: shareID!, deviceID, meta });
  }, [isIdle, createSession, shareID, deviceID, meta]);

  const {
    data: survey,
    isLoading: surveyLoading,
    isError: surveyError,
  } = useFetchSurvey(shareID!, deviceID, {
    enabled: sessionReady,
  });

  const participantSession = survey?.participantSession;

  useEffect(() => {
    if (participantSession) {
      setSession(participantSession);
    }
  }, [participantSession, setSession]);

  if (surveyLoading || sessionPending || !survey) {
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

  return (
    <FlowRuntimeProvider payload={survey}>
      <ResponseRegistryProvider persistedResponses={survey.responses}>
        <SurveyScreenLayout surveyID={survey.surveyID} shareID={shareID} />
      </ResponseRegistryProvider>
    </FlowRuntimeProvider>
  );
};

export default SurveyContainer;
