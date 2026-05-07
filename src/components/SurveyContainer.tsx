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
import { getSurveyUnavailableVariant } from "@/utils/getSurveyUnavailabel";
import { SurveyUnavailableScreen } from "./screens/SurveyUnavailabelScreen";

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
    isError: sessionError,
    error: createSessionError,
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
    error: fetchSurveyError,
  } = useFetchSurvey(shareID!, deviceID, {
    enabled: sessionReady,
  });

  const participantSession = survey?.participantSession;

  useEffect(() => {
    if (participantSession) {
      setSession(participantSession);
    }
  }, [participantSession, setSession]);

  if (sessionError) {
    const variant = getSurveyUnavailableVariant(createSessionError);

    return <SurveyUnavailableScreen variant={variant} />;
  }

  if (surveyError) {
    const variant = getSurveyUnavailableVariant(fetchSurveyError);

    return <SurveyUnavailableScreen variant={variant} />;
  }

  if (surveyLoading || sessionPending || !survey) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <LogoLoader />
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
