import { completeSession, createSession } from "@/api/sessionApi";
import { useMutation } from "@tanstack/react-query";


export const useCreateSession = () =>
  useMutation({ mutationFn: createSession });

export const useCompleteSession = () =>
  useMutation({ mutationFn: completeSession });
