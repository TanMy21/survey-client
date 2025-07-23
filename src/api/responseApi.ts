import type { ResponseData } from "@/types/response";

export const postResponse = async ({
  questionID,
  qType,
  optionID,
  response,
  participantID,
}: ResponseData) => {
  try {
    const data = {
      questionID,
      qType,
      optionID,
      response,
      participantID,
    };

    const responseCreated = await fetch(
      `${import.meta.env.VITE_BASE_URL}/q/res`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!responseCreated.ok) {
      throw new Error("Failed to post response");
    }

    const responseData = await responseCreated.json();
    return responseData;
  } catch (error) {
    console.error("Error posting response:", error);
    throw error;
  }
};