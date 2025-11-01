import type { Session, SessionContextValue } from "@/types/sessionTypes";
import React, { createContext, useContext, useState } from "react";

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);

  const clearSession = () => setSession(null);

  return (
    <SessionContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
