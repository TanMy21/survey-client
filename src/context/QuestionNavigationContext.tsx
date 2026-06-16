import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type SubmitFn = (() => void) | null;

type Ctx = {
  setSubmitHandler: (fn: SubmitFn) => void;
  requestSubmit: () => void;
  hasSubmitHandler: boolean;
};

const QuestionNavigationContext = createContext<Ctx | undefined>(undefined);

export function useQuestionSubmit(): Ctx {
  const ctx = useContext(QuestionNavigationContext);
  if (!ctx) {
    throw new Error("useQuestionSubmit must be used within <QuestionSubmitProvider />");
  }
  return ctx;
}

 export function useRegisterQuestionSubmit(enabled: boolean, handler: () => void | Promise<void>) {
  const { setSubmitHandler } = useQuestionSubmit();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return setSubmitHandler(null);
    return setSubmitHandler(() => handlerRef.current());
  }, [enabled, setSubmitHandler]);
}

export const QuestionSubmitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const submitRef = useRef<SubmitFn>(null);
  const tokenRef = useRef<symbol | null>(null);
  const [hasSubmitHandler, setHasSubmitHandler] = useState(false);

  const setSubmitHandler = useCallback((fn: SubmitFn) => {
    const token = Symbol("question-submit");
    submitRef.current = fn;
    tokenRef.current = token;
    setHasSubmitHandler(Boolean(fn));

    return () => {
      if (tokenRef.current !== token) return;
      submitRef.current = null;
      tokenRef.current = null;
      setHasSubmitHandler(false);
    };
  }, []);

  const requestSubmit = useCallback(() => {
    submitRef.current?.();
  }, []);

  return (
    <QuestionNavigationContext.Provider value={{ setSubmitHandler, requestSubmit, hasSubmitHandler }}>
      {children}
    </QuestionNavigationContext.Provider>
  );
};
