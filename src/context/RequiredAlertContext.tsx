 
import { createContext, useContext, useState } from "react";

interface RequiredAlertContextType {
  open: boolean;
  showAlert: () => void;
  hideAlert: () => void;
}

const RequiredAlertContext = createContext<RequiredAlertContextType | undefined>(undefined);

export const RequiredAlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const showAlert = () => setOpen(true);
  const hideAlert = () => setOpen(false);

  return (
    <RequiredAlertContext.Provider value={{ open, showAlert, hideAlert }}>
      {children}
    </RequiredAlertContext.Provider>
  );
};

export const useRequiredAlert = () => {
  const context = useContext(RequiredAlertContext);
  if (!context) {
    throw new Error("useRequiredAlert must be used within a RequiredAlertProvider");
  }
  return context;
};
