import type { AxiosError } from "axios";
import { useAlert } from "~/context/AlertContext";
import { defaultErrorMessage } from "~/utils/defaultErrorMessage";

const filterErrorLogin = (
  error: AxiosError<{
    message: string;
  }>,
) => {
  const { showAlert } = useAlert();
  if (
    error.status == 401 &&
    error.response?.data.message == "Credenciais inválidas."
  ) {
    showAlert({
      variant: "error",
      title: "Credenciais inválidas",
      message:
        "A combinação de CPF e senha informados está incorreta. Verifique e tente novamente!",
    });
    return;
  } else if (
    error.status == 403 &&
    error.response?.data.message == "Avaliação pendente"
  ) {
    showAlert({
      variant: "error",
      title: "Aguardando avaliação",
      message:
        "O seu cadastro ainda não foi validado. Aguarde ou contate um administrador do sistema.",
    });
    return;
  } else if (
    error.status == 403 &&
    error.response?.data.message == "Usuário recusado"
  ) {
    showAlert({
      variant: "error",
      title: "Erro ao acessar",
      message:
        "Você não tem permissão para logar no sistema. Entre em contato com um administrador do sistema.",
    });
    return;
  } else {
    showAlert(defaultErrorMessage);
  }
};

export { filterErrorLogin };
