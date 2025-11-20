import { completeSession, createSession } from "@/api/sessionApi";
import type { Session, SessionArgs } from "@/types/sessionTypes";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";


export const useCreateSession = (
  options?: UseMutationOptions<Session, Error, SessionArgs>
) =>
  useMutation<Session, Error, SessionArgs>({
    mutationFn: createSession,  // <--- typed to accept SessionArgs
    ...options,
  });

export const useCompleteSession = () =>
  useMutation({ mutationFn: completeSession });
