import { Button, Card, CardContent, Container, TextField } from "@mui/material";
import { useState } from "react";
import logo from "../../assets/file.svg";
import { validateCPF } from "~/utils/validateCPF";
import { Input } from "~/components/Input";
import { useNavigate } from "react-router";
import { validatePassword } from "~/utils/validatePassword";
import { validateRules } from "~/utils/validateRules";
import { useAlert } from "~/context/AlertContext";
import api from "~/services/axios";

export function CadastroPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<{
    name?: string;
    username?: string;
    password?: string;
    passwordComfirm?: string;
  }>({});

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const rules = {
    name: [(value?: string) => !!value || "Campo obrigatório"],
    username: [
      (value?: string) => !!value || "Campo obrigatório",
      (value?: string) => validateCPF(value!) || "CPF inválido",
    ],
    password: [
      (value?: string) => !!value || "Campo obrigatório",
      (value?: string) =>
        validatePassword(value!) ||
        "A senha deve possuir no mínimo 6 dígitos, números e letras",
    ],
    passwordComfirm: [
      (value?: string) => !!value || "Campo obrigatório",
      (value?: string) => value! == form.password || "As senhas não batem",
    ],
  };

  const handleLogin = async () => {
    navigate("/login");
  };

  const handleRegister = async () => {
    try {
      setIsLoading(false);
      const isValid = validateRules(form, rules);
      if (!isValid) return;
      await api.post("/usuarios", {
        cpf: form.username?.replace(/\D/g, ""),
        senha: form.password,
        nome: form.name,
      });
      showAlert({
        variant: "success",
        title: "Cadastro realizado com sucesso!",
        message:
          "Seu cadastro foi realizado com sucesso! Aguarde sua solicitação ser aceita para acessar o sistema.",
        onClickRightButton: () => {
          navigate("/login");
        },
      });
    } catch (error) {
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
                    value={form.name}
                    setValue={(value) =>
                      setForm({
                        ...form,
                        name: value,
                      })
                    }
                    placeholder="Informe seu nome"
                    rules={rules.name}
                  />

                  <Input
                    label="CPF"
                    value={form.username}
                    setValue={(value) =>
                      setForm({
                        ...form,
                        username: value,
                      })
                    }
                    placeholder="000.000.000-00"
                    mask="cpf"
                    rules={rules.username}
                  />

                  <Input
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={form.password}
                    setValue={(value) =>
                      setForm({
                        ...form,
                        password: value,
                      })
                    }
                    password
                    rules={rules.password}
                  />

                  <Input
                    label="Confirme sua senha"
                    placeholder="Digite sua senha"
                    value={form.passwordComfirm}
                    setValue={(value) =>
                      setForm({
                        ...form,
                        passwordComfirm: value,
                      })
                    }
                    password
                    rules={rules.passwordComfirm}
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
