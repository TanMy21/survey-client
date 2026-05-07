import type { SurveyFetchError, SurveyUnavailableVariant } from "@/types/surveyTypes";

export const getSurveyUnavailableVariant = (error: unknown): SurveyUnavailableVariant => {
  const surveyError = error as SurveyFetchError;

  if (surveyError?.code === "SURVEY_NOT_FOUND") {
    return "not-found";
  }

  if (surveyError?.code === "SURVEY_EXPIRED") {
    return "expired";
  }

  if (surveyError?.code === "SURVEY_NOT_STARTED") {
    return "not-started";
  }

  if (surveyError?.code === "SURVEY_NOT_AVAILABLE") {
    return "unavailable";
  }

  if (surveyError?.status === 404) {
    return "not-found";
  }

  if (surveyError?.status === 410) {
    return "expired";
  }

  if (surveyError?.status === 403) {
    return "unavailable";
  }

  return "error";
};
