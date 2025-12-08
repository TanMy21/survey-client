import { completeSession, createSession, markActiveApi, pauseSession } from "@/api/sessionApi";
import type { Session, SessionArgs } from "@/types/sessionTypes";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useCreateSession = (options?: UseMutationOptions<Session, Error, SessionArgs>) =>
  useMutation<Session, Error, SessionArgs>({
    mutationFn: createSession,
    ...options,
  });

export const useCompleteSession = () => useMutation({ mutationFn: completeSession });

export const usePauseSession = () =>
  useMutation({
    mutationFn: pauseSession,
  });

export const useMarkActive = () =>
  useMutation({
    mutationFn: markActiveApi,
  });
