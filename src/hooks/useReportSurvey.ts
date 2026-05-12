import { reportSurvey } from "@/api/reportSurveyApi";
import type { ReportSurveyArgs, ReportSurveyResponse } from "@/types/reportSurveyTypes";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useReportSurvey = (
  options?: UseMutationOptions<ReportSurveyResponse, Error, ReportSurveyArgs>
) =>
  useMutation<ReportSurveyResponse, Error, ReportSurveyArgs>({
    mutationFn: reportSurvey,
    ...options,
  });
