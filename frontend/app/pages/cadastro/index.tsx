import { Button, Card, CardContent, Container, TextField } from "@mui/material";
import { useState } from "react";
import logo from "../../assets/file.svg";
import { validateCPF } from "~/utils/validateCPF";
import { Input } from "~/components/Input";
import { useNavigate } from "react-router";
import { validatePassword } from "~/utils/validatePassword";

export function CadastroPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordComfirm, setPasswordComfirm] = useState<string>();
  const [name, setName] = useState<string>();

  const navigate = useNavigate();

  const handleLogin = async () => {
    navigate("/login");
  };

  const handleRegister = () => {
    try {
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-full">
      <Container maxWidth="lg" className="h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <Card
            className="h-fit min-h-48 w-full rounded-2xl max-w-xl bg-[#19273170]"
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
                  Faça seu cadastro em nosso sistema!
                </p>

                <div className="flex flex-col w-full gap-4">
                  <Input
                    label="Nome"
                    value={name}
                    setValue={setName}
                    placeholder="Informe seu nome"
                    rules={[(value?: string) => !!value || "Campo obrigatório"]}
                  />

                  <Input
                    label="CPF"
                    value={username}
                    setValue={setUsername}
                    placeholder="000.000.000-00"
                    rules={[
                      (value?: string) => !!value || "Campo obrigatório",
                      (value?: string) => validateCPF(value!) || "CPF inválido",
                    ]}
                  />

                  <Input
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={password}
                    setValue={setPassword}
                    password
                    rules={[
                      (value?: string) => !!value || "Campo obrigatório",
                      (value?: string) =>
                        validatePassword(value!) ||
                        "A senha deve possuir no mínimo 6 dígitos, números e letras",
                    ]}
                  />

                  <Input
                    label="Confirme sua senha"
                    placeholder="Digite sua senha"
                    value={passwordComfirm}
                    setValue={setPasswordComfirm}
                    password
                    rules={[
                      (value?: string) => !!value || "Campo obrigatório",
                      (value?: string) =>
                        value! == password || "As senhas não batem",
                    ]}
                  />
                </div>

                <div className="w-full flex flex-row gap-4 justify-between">
                  <Button
                    className="h-full min-h-14 w-100"
                    variant="outlined"
                    loading={isLoading}
                    onClick={handleLogin}
                  >
                    <b>Voltar</b>
                  </Button>
                  <Button
                    className="h-full min-h-14 w-100"
                    variant="contained"
                    loading={isLoading}
                    onClick={handleRegister}
                  >
                    <b>Cadastrar</b>
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
