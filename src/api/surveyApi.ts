import type { SurveyFetchError } from "@/types/surveyTypes";

export const fetchSurvey = async (shareID: string, deviceID: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/ses/${shareID}?deviceID=${deviceID}`
    );

    const data = await response.json().catch(() => null);


    

    if (!response.ok) {
      const error = new Error(data?.message || "Error loading survey.") as SurveyFetchError;

      // HTTP status fallback,   404, 410, 403.
      error.status = response.status;

      // Backend error code, e.g. SURVEY_NOT_FOUND, SURVEY_EXPIRED.
      error.code = data?.code;

      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching survey: ", error);
    throw error;
  }
};
