import { Button, Card, CardContent, Container, TextField } from "@mui/material";
import { useState } from "react";
import logo from "../../assets/file.svg";
import { validateCPF } from "~/utils/validateCPF";
import { Input } from "~/components/Input";
import { useNavigate } from "react-router";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(false);
    } catch (error) {
      console.log(error);
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
                    rules={[
                      (value?: string) => !!value || "Campo obrigatório",
                      (value?: string) => validateCPF(value!) || "CPF inválido",
                    ]}
                  />

                  <Input
                    label="Senha"
                    value={password}
                    setValue={setPassword}
                    password
                    rules={[(value?: string) => !!value || "Campo obrigatório"]}
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
