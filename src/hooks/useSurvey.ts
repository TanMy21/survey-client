import { postResponse, recordConsent, submitEmailResponse } from "@/api/responseApi";
import { fetchSurvey } from "@/api/surveyApi";
import type { EmailResponsePayload, EmailResponseResult, RecordConsentPayload, RecordConsentResponse  } from "@/types/responseTypes";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useFetchSurvey = (shareID: string) => {
  return useQuery({
    queryKey: ["survey", shareID],
    queryFn: () => fetchSurvey(shareID),
    staleTime: 5 * 60 * 1000, // 5 mins
  });
};

export function useSubmitResponse() {
  return useMutation ({
    mutationFn: postResponse,
  });
}

export function useRecordConsent() {
  return useMutation<RecordConsentResponse, Error, RecordConsentPayload>({
    mutationFn: recordConsent,
  });
}

export function useSubmitEmailResponse() {
  return useMutation<EmailResponseResult, Error, EmailResponsePayload>({
    mutationFn: submitEmailResponse,
  });
}