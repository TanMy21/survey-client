import type { PauseSessionArgs, SessionArgs } from "@/types/sessionTypes";

export const createSession = async ({ shareID, deviceID, meta }: SessionArgs) => {
  try {
    const sessionCreated = await fetch(`${import.meta.env.VITE_BASE_URL}/ses/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shareID, deviceID, meta }),
    });

    if (sessionCreated) {
      return sessionCreated.json();
    } else {
      throw new Error("Failed to create session");
    }
  } catch (error) {
    console.error("Error creating session: ", error);
    throw error;
  }
};

export const completeSession = async ({ surveyID, deviceID, shareID }: SessionArgs) => {
  try {
    const sessionCompleted = await fetch(`${import.meta.env.VITE_BASE_URL}/ses/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ surveyID, deviceID, shareID }),
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

export async function pauseSession({ surveyID, deviceID }: PauseSessionArgs) {
  try {
    await fetch(`${import.meta.env.VITE_BASE_URL}/ses/pause`, {
      method: "POST",
      keepalive: true, // for tab close
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyID, deviceID }),
    });
  } catch (e) {
    console.warn("pauseSession failed:", e);
  }
}

export async function markActiveApi({
  surveyID,
  deviceID,
}: {
  surveyID: string;
  deviceID: string;
}) {
  await fetch(`${import.meta.env.VITE_BASE_URL}/ses/active`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ surveyID, deviceID }),
  });
}
