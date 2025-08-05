import { fetchSurvey } from "@/api/surveyApi";
import { useQuery } from "@tanstack/react-query";


export const useFetchSurvey = (shareID: string) => {
  return useQuery({
    queryKey: ["survey", shareID],
    queryFn: () => fetchSurvey(shareID),
    staleTime: 5 * 60 * 1000, // 5 mins
  });
};
