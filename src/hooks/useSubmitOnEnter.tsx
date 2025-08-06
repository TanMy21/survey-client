import { type KeyboardEvent } from "react";

type SubmitFunction = () => void;

export const useSubmitOnEnter = (submitFn: SubmitFunction) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitFn();
    }
  };

  return handleKeyDown;
};
