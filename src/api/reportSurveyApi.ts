import type { ReportSurveyArgs, ReportSurveyResponse } from "@/types/reportSurveyTypes";

export const reportSurvey = async ({
  shareID,
  reason,
  description,
  screenshot,
}: ReportSurveyArgs): Promise<ReportSurveyResponse> => {
  try {
    const formData = new FormData();

    // survey/report fields.
    formData.append("shareID", shareID);
    formData.append("reason", reason);

    if (description?.trim()) {
      formData.append("description", description.trim());
    }

    if (screenshot) {
      formData.append("screenshot", screenshot);
    }

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/survey/report`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to submit report");
    }

    return result;
  } catch (error) {
    console.error("Error reporting survey: ", error);
    throw error;
  }
};
