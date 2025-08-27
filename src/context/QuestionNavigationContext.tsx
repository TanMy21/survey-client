import React, { createContext, useCallback, useContext, useRef } from "react";

type SubmitFn = (() => void) | null;

type Ctx = {
  setSubmitHandler: (fn: SubmitFn) => void;
  requestSubmit: () => void;
};

const QuestionNavigationContext = createContext<Ctx | undefined>(undefined);

export function useQuestionSubmit(): Ctx {
  const ctx = useContext(QuestionNavigationContext);
  if (!ctx) {
    throw new Error("useQuestionSubmit must be used within <QuestionSubmitProvider />");
  }
  return ctx;
}

// const QuestionNavigationContext = createContext<{
//   setSubmitHandler: (fn: SubmitFn) => void;
//   requestSubmit: () => void;
// }>({
//   setSubmitHandler: () => {},
//   requestSubmit: () => {},
// });

// export const useQuestionSubmit = () => useContext(QuestionNavigationContext);

export const QuestionSubmitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const submitRef = useRef<SubmitFn>(null);

  const setSubmitHandler = useCallback((fn: SubmitFn) => {
    submitRef.current = fn;
  }, []);

  const requestSubmit = useCallback(() => {
    if (submitRef.current) submitRef.current();
  }, []);

  return (
    <QuestionNavigationContext.Provider value={{ setSubmitHandler, requestSubmit }}>
      {children}
    </QuestionNavigationContext.Provider>
  );
};
