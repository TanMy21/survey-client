export const fetchSurvey = async (surveyID: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/ses/${surveyID}`);

    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching survey: ", error);
    throw error;
  }
};
