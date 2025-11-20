import { postResponse, postResponseSkipped, recordConsent, submitEmailResponse } from "@/api/responseApi";
import { fetchSurvey } from "@/api/surveyApi";
import type { EmailResponsePayload, EmailResponseResult, RecordConsentPayload, RecordConsentResponse, SubmitResponseSkippedPayload  } from "@/types/responseTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export const useFetchSurvey = (
  shareID: string,
  deviceID: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["survey", shareID],
    queryFn: () => fetchSurvey(shareID, deviceID),
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,   
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


export function useSubmitResponseSkipped() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["submit-response-skipped"],
    mutationFn: (payload: SubmitResponseSkippedPayload) => postResponseSkipped(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["survey-progress"] });
    },
  });
}