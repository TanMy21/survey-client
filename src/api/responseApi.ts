import type { BehaviorArgs, EmailResponsePayload, EmailResponseResult, RecordConsentPayload, RecordConsentResponse, ResponseData } from "@/types/responseTypes";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export const postResponse = async ({
  questionID,
  qType,
  optionID,
  response,
  deviceID,
  behavior,
}: ResponseData) => {
  try {
    const data = {
      questionID,
      qType,
      optionID,
      response,
      deviceID,
      behavior,
    };

    const responseCreated = await fetch(`${import.meta.env.VITE_BASE_URL}/q/res`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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


export const recordConsent = async({
  deviceID,
  ...body
}: RecordConsentPayload): Promise<RecordConsentResponse> => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/q/res/consent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": `${deviceID}-consent`,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to record consent (${res.status})`);
  }
  return res.json();
}

export const submitEmailResponse = async ({
 deviceID, questionID, email, behavior
}: EmailResponsePayload): Promise<EmailResponseResult> => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/q/res/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": `email-${deviceID}-${questionID}-${email}`,
    },
    credentials: "include",
    body: JSON.stringify({
     deviceID, questionID, email, behavior
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to submit email (${res.status})`);
  }
  return res.json();
}


async function postBehavior(payload: {
  deviceID: string;
  questionID: string;
  behavior: unknown;
}) {
  await fetch(`${import.meta.env.VITE_BASE_URL}/q/beh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": `behavior-${payload.deviceID}-${payload.questionID}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}

export function useBehaviorFlush({
  registerBeforeNext,
  collectBehaviorData,
  questionID,
  deviceID,
}: BehaviorArgs) {
  const sentRef = useRef(false);
  const { mutateAsync } = useMutation({ mutationFn: postBehavior });

  useEffect(() => {
    // register once per screen
    const unregister = registerBeforeNext(async () => {
      if (sentRef.current) return;
      const behavior = collectBehaviorData();
      await mutateAsync({
        deviceID,
        questionID,  
        behavior, 
      });
      sentRef.current = true;
    });
    return unregister;
  }, [registerBeforeNext, collectBehaviorData, mutateAsync, questionID, deviceID]);

  // (optional) a manual flush you can call in button handler if you want
  return {
    flushOnce: async () => {
      if (sentRef.current) return;
      const behavior = collectBehaviorData();
      await mutateAsync({
        questionID,
        deviceID,
        behavior, 
      });
      sentRef.current = true;
    },
  };
}