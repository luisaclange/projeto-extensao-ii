import type { AxiosError } from "axios";
import type { IAlertMessage } from "~/components/AlertMessage";
import { useAlert } from "~/context/AlertContext";
import { defaultErrorMessage } from "~/utils/defaultErrorMessage";

const filterErrorLogin = (
  error: AxiosError<{
    message: string;
  }>,
): Omit<IAlertMessage, "isOpen" | "setIsOpen"> => {
  if (
    error.status == 401 &&
    error.response?.data.message == "Credenciais inválidas."
  ) {
    return {
      variant: "error",
      title: "Credenciais inválidas",
      message:
        "A combinação de CPF e senha informados está incorreta. Verifique e tente novamente!",
    };
  } else if (
    error.status == 403 &&
    error.response?.data.message == "Avaliação pendente"
  ) {
    return {
      variant: "error",
      title: "Aguardando avaliação",
      message:
        "O seu cadastro ainda não foi validado. Aguarde ou contate um administrador do sistema.",
    };
  } else if (
    error.status == 403 &&
    error.response?.data.message == "Usuário recusado"
  ) {
    return {
      variant: "error",
      title: "Erro ao acessar",
      message:
        "Você não tem permissão para logar no sistema. Entre em contato com um administrador do sistema.",
    };
  } else {
    return defaultErrorMessage;
  }
};

export { filterErrorLogin };
