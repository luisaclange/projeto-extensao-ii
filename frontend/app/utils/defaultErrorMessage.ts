import type { IAlertMessage } from "~/components/AlertMessage";

const defaultErrorMessage: Omit<IAlertMessage, "isOpen" | "setIsOpen"> = {
  variant: "error",
  title: "Ocorreu um erro",
  message: "Estamos passando por instabilidades. Tente novamente mais tarde!",
};

export { defaultErrorMessage };
