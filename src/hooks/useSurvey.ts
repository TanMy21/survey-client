import { fetchSurvey } from "@/api/surveyApi";
import { useQuery } from "@tanstack/react-query";


export const useFetchSurvey = (surveyID: string) => {
  return useQuery({
    queryKey: ["survey", surveyID],
    queryFn: () => fetchSurvey(surveyID),
    staleTime: 5 * 60 * 1000, // 5 mins
  });
};
