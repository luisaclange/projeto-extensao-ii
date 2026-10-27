import { createContext, useContext, useState } from "react";
import { AlertMessage, type IAlertMessage } from "~/components/AlertMessage";

interface AlertContextType {
  showAlert: (options: Omit<IAlertMessage, "isOpen" | "setIsOpen">) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<
    Omit<IAlertMessage, "isOpen" | "setIsOpen">
  >({
    message: "",
    title: "",
  });

  function showAlert(options: Omit<IAlertMessage, "isOpen" | "setIsOpen">) {
    setOptions(options);
    setOpen(true);
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <AlertMessage
        isOpen={open}
        message={options.message}
        title={options.title}
        setIsOpen={(value: boolean) => setOpen(value)}
        labelLeftButton={options.labelLeftButton}
        labelRightButton={options.labelRightButton}
        onClickLeftButton={options.onClickLeftButton}
        onClickRightButton={options.onClickRightButton}
        variant={options.variant}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert deve ser usado dentro de AlertProvider");
  }

  return context;
}
