import { completeSession, createSession } from "@/api/sessionApi";
import type { Session } from "@/types/sessionTypes";
import { v4 as uuid } from "uuid";
import { getOrCreateDeviceId } from "./deviceID";
import { buildParticipantMeta } from "./fingerprint";

export const getParticipantID = () => {
  let participantID = localStorage.getItem("participantID");
  if (!participantID) {
    participantID = uuid();
    localStorage.setItem("participantID", participantID);
  }
  return participantID;
};

export const clearParticipantId = () => {
  localStorage.removeItem("participantID");
};

export const quizSessionStarted = async (shareID: string) => {
  try {
    const deviceID = getOrCreateDeviceId();
    const meta = buildParticipantMeta();
    const sessionCreated = await createSession({ shareID, deviceID, meta });
    if (sessionCreated) {
      return sessionCreated;
    } else {
      throw new Error("Failed to start quiz session");
    }
  } catch (error) {
    console.error("Error starting quiz session: ", error);
    throw error;
  }
};

export const quizSessionCompleted = async (surveyID: string, shareID: string) => {
  try {
    const deviceID = getOrCreateDeviceId();

    const sessionCompleted = await completeSession({ surveyID, shareID, deviceID });
    if (sessionCompleted) {
      return sessionCompleted;
    } else {
      throw new Error("Failed to complete quiz session");
    }
  } catch (error) {
    console.error("Error completing quiz session: ", error);
    throw error;
  }
};

export const isSessionCompleted = (sessions: Session[]) => {
  let participantId = getParticipantID();

  const isCompleted = sessions.some(
    (session: Session) =>
      session.participantID === participantId && session.sessionState === "COMPLETED"
  );

  return isCompleted;
};
