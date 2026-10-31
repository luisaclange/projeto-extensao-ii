import {
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { ILote } from "~/types/lote.type";
import { LoaderPage } from "~/components/LoaderPage";
import { ChevronLeft } from "@mui/icons-material";
import { AppBar } from "~/components/AppBar";
import { useNavigate } from "react-router";
import { useAlert } from "~/context/AlertContext";
import api from "~/services/axios";
import { Input } from "~/components/Input";
import { validateCPF } from "~/utils/validateCPF";
import { validatePassword } from "~/utils/validatePassword";
import { validateRules } from "~/utils/validateRules";
import type { IUsuario } from "~/types/usuario.type";
import { formatCPF } from "~/utils/formatCPF";

export interface IResLote extends ILote {
  createdAt?: string | number | Date;
  numeroPedidos?: number;
  numeroItems?: number;
}

export function PerfilPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<{
    name?: string;
    username?: string;
    password?: string;
    passwordComfirm?: string;
  }>({});
  const [usuario, setUsuario] = useState<IUsuario>();

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const rules = {
    name: [(value?: string) => !!value || "Campo obrigatório"],
    username: [
      (value?: string) => !!value || "Campo obrigatório",
      (value?: string) => validateCPF(value!) || "CPF inválido",
    ],
    password: [
      (value?: string) =>
        validatePassword(value!) ||
        "A senha deve possuir no mínimo 6 dígitos, números e letras",
    ],
    passwordComfirm: [
      (value?: string) => value! == form.password || "As senhas não batem",
    ],
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleEdit = async () => {
    try {
      setIsLoading(false);
      const isValid = validateRules(form, rules);
      if (!isValid) return;
      await api.put(`/usuarios/${usuario?.id}`, {
        cpf: form.username?.replace(/\D/g, ""),
        senha: form.password,
        nome: form.name,
      });
      showAlert({
        variant: "success",
        title: "Alterações salvas com sucesso!",
        message: "Suas alterações foram salvas no sistema com sucesso!",
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

  const deleteAccount = async () => {
    try {
      setIsLoading(false);
      const isValid = validateRules(form, rules);
      if (!isValid) return;
      await api.delete(`/auth/account`);
      showAlert({
        variant: "success",
        title: "Conta deletada",
        message: "Sua conta foi deletada com sucesso!",
        onClickRightButton: () => {
          localStorage.clear();
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

  const handleDeleteAccount = () => {
    showAlert({
      variant: "warning",
      title: "Confirmar exclusão",
      message:
        "Tem certeza de que deseja excluir sua conta? Essa ação é irreversível.",
      onClickRightButton: () => {
        deleteAccount();
      },
      labelLeftButton: "Não",
      labelRightButton: "Sim",
      onClickLeftButton: () => {},
    });
  };

  useEffect(() => {
    api
      .get("/auth/account")
      .then((data) => {
        setUsuario(data.data);
        setForm({
          name: data.data.nome,
          username: formatCPF(data.data.cpf),
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section>
      <AppBar />
      <Container maxWidth="lg" className="my-4">
        {isLoading ? (
          <LoaderPage />
        ) : (
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4 border-b-2 border-dashed pb-2">
                <IconButton onClick={handleBack}>
                  <ChevronLeft fontSize="large" color="secondary" />
                </IconButton>
                <h2>Minha conta</h2>
              </div>

              <Card
                className="h-fit w-full rounded-2xl mt-8 bg-[#19273170]"
                sx={{ borderRadius: "16px" }}
                elevation={0}
              >
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-full flex flex-col gap-8 max-w-2xl">
                    <h2>Alteração de dados</h2>

                    <p className="text-white">
                      Altere seus dados pessoais preenchendo os campos desejados
                      e clique em salvar para confirmar as alterações. Não é
                      necessário informar sua senha atual para atualizar essas
                      informações.
                      <br />
                      Caso queira alterar sua senha, preencha os campos{" "}
                      <b>Nova senha</b> e <b>Confirmar nova senha</b>.
                      Certifique-se de que ambas sejam iguais antes de salvar.
                    </p>

                    <div className="flex flex-col w-full gap-4">
                      <Input
                        label="Nome"
                        value={form.name}
                        setValue={(value?: string) =>
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
                        setValue={(value?: string) =>
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
                        label="Nova senha"
                        placeholder="Digite sua senha"
                        value={form.password}
                        setValue={(value?: string) =>
                          setForm({
                            ...form,
                            password: value,
                          })
                        }
                        password
                        rules={rules.password}
                        autoComplete="new-password"
                      />

                      <Input
                        label="Confirme sua senha"
                        placeholder="Digite sua senha"
                        value={form.passwordComfirm}
                        setValue={(value?: string) =>
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
                        className="h-full min-h-14"
                        variant="outlined"
                        color="error"
                        loading={isLoading}
                        onClick={handleDeleteAccount}
                      >
                        <b>Excluir usuário</b>
                      </Button>
                      <Button
                        className="h-full min-h-14"
                        variant="contained"
                        loading={isLoading}
                        onClick={handleEdit}
                      >
                        <b>Salvar alterações</b>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
