import type { SessionArgs } from "@/types/sessionTypes";

export const createSession = async ({ surveyID, participantID }: SessionArgs) => {
  try {
    const sessionCreated = await fetch(`${import.meta.env.VITE_BASE_URL}/ses/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ surveyID, participantID }),
    });

    if (sessionCreated) {
      return true;
    } else {
      throw new Error("Failed to create session");
    }
  } catch (error) {
    console.error("Error creating session: ", error);
    throw error;
  }
};

export const completeSession = async ({ surveyID, participantID }: SessionArgs) => {
  try {
    const sessionCompleted = await fetch(`${import.meta.env.VITE_BASE_URL}/ses/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ surveyID, participantID }),
    });

    if (sessionCompleted) {
      return true;
    } else {
      throw new Error("Failed to complete session");
    }
  } catch (error) {
    console.error("Error completing session: ", error);
    throw error;
  }
};
