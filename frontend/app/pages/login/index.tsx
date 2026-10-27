import { Button, Card, CardContent, Container } from "@mui/material";
import { useState } from "react";
import logo from "../../assets/file.svg";
import { validateCPF } from "~/utils/validateCPF";
import { Input } from "~/components/Input";
import { useNavigate } from "react-router";
import api from "~/services/axios";
import { isAxiosError } from "axios";
import { validateRules } from "~/utils/validateRules";
import { useAlert } from "~/context/AlertContext";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const { showAlert } = useAlert();

  const rulesUsername = [
    (value?: string) => !!value || "Campo obrigatório",
    (value?: string) => validateCPF(value!) || "CPF inválido",
  ];
  const rulesPassword = [(value?: string) => !!value || "Campo obrigatório"];

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(false);
      const isValid = validateRules([
        {
          rules: rulesUsername,
          value: username,
        },
        {
          rules: rulesPassword,
          value: password,
        },
      ]);
      if (!isValid) return;
      const response = await api.post("/login", {
        cpf: username?.replace(/\D/g, ""),
        senha: password,
      });
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem(
        "expireSession",
        new Date().getTime() + response.data.expiresIn,
      );
      navigate("/");
    } catch (error) {
      if (isAxiosError(error)) {
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
        }
      }
      showAlert({
        variant: "error",
        title: "Ocorreu um erro",
        message:
          "Estamos passando por instabilidades. Tente novamente mais tarde!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/cadastro");
  };

  return (
    <section className="h-full">
      <Container maxWidth="lg" className="h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <Card
            className="h-fit min-h-48 w-full rounded-2xl max-w-xl"
            sx={{ borderRadius: "16px" }}
            elevation={0}
          >
            <CardContent className="p-4 flex flex-col items-center">
              <img src={logo} width="100px" />
              <b style={{ fontFamily: "Lora" }} className="text-4xl text-white">
                Sweet Track
              </b>
              <div className="w-full mt-8 flex flex-col gap-8">
                <p className="text-white text-center">
                  Faça seu login na plataforma!
                </p>

                <div className="flex flex-col w-full gap-4">
                  <Input
                    label="CPF"
                    value={username}
                    setValue={setUsername}
                    placeholder="000.000.000-00"
                    mask="cpf"
                    rules={rulesUsername}
                  />

                  <Input
                    label="Senha"
                    value={password}
                    setValue={setPassword}
                    password
                    rules={rulesPassword}
                  />
                </div>

                <div className="w-full flex flex-row gap-4 justify-between">
                  <Button
                    className="h-full min-h-14 w-100"
                    variant="outlined"
                    loading={isLoading}
                    onClick={handleRegister}
                  >
                    <b>Cadastrar</b>
                  </Button>
                  <Button
                    className="h-full min-h-14 w-100"
                    variant="contained"
                    loading={isLoading}
                    onClick={handleLogin}
                  >
                    <b>Entrar</b>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
