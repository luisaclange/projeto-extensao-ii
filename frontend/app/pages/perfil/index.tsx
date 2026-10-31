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
import type { IUsuario } from "~/types/usuario.type";
import { formatCPF } from "~/utils/formatCPF";
import { useForm } from "react-hook-form";
import { defaultErrorMessage } from "~/utils/defaultErrorMessage";
import { Btn } from "~/components/Btn";
import { FooterApp } from "~/components/FooterApp";

interface IProfileForm {
  name?: string;
  username?: string;
  password?: string;
  passwordConfirm?: string;
}

export function PerfilPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const {
    control,
    handleSubmit,
    setValues,
    getValues,
    formState: { isSubmitting },
  } = useForm<IProfileForm>({
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
      name: "",
      passwordConfirm: "",
    },
  });
  const [usuario, setUsuario] = useState<IUsuario>();

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleBack = () => {
    navigate("/");
  };

  const handleEdit = async (data: IProfileForm) => {
    try {
      setIsLoadingUpdate(false);
      await api.put(`/usuarios/${usuario?.id}`, {
        cpf: data.username?.replace(/\D/g, ""),
        senha: data.password,
        nome: data.name,
      });
      setValues({
        name: data.name,
        username: data.username,
        password: "",
        passwordConfirm: "",
      });
      showAlert({
        variant: "success",
        title: "Alterações salvas com sucesso!",
        message: "Suas alterações foram salvas no sistema com sucesso!",
      });
    } catch (error) {
      showAlert(defaultErrorMessage);
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setIsLoadingDelete(false);
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
      showAlert(defaultErrorMessage);
    } finally {
      setIsLoadingDelete(false);
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
        setValues({
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

                    <form
                      onSubmit={handleSubmit(handleEdit)}
                      className="h-full flex flex-col gap-8"
                    >
                      <div className="flex flex-col w-full gap-4">
                        <Input
                          name="name"
                          label="Nome"
                          control={control}
                          placeholder="Informe seu nome"
                          rules={{
                            required: "Campo obrigatório",
                          }}
                        />

                        <Input
                          name="username"
                          label="CPF"
                          autoComplete="new-password"
                          control={control}
                          placeholder="000.000.000-00"
                          mask="cpf"
                          rules={{
                            required: "Campo obrigatório",
                            validate: (value) =>
                              validateCPF(value!) || "CPF inválido",
                          }}
                        />

                        <Input
                          name="password"
                          label="Nova senha"
                          control={control}
                          password
                          autoComplete="new-password"
                          rules={{
                            validate: (value) =>
                              validatePassword(value!) ||
                              "A senha deve possuir no mínimo 6 dígitos, números e letras",
                          }}
                        />

                        <Input
                          name="passwordConfirm"
                          label="Confirme sua senha"
                          placeholder="Digite sua senha"
                          control={control}
                          password
                          rules={{
                            validate: (value) =>
                              value == getValues().password ||
                              "As senhas não batem",
                          }}
                        />
                      </div>

                      <div className="w-full flex flex-row gap-4 justify-between">
                        <Btn
                          variant="secondary"
                          color="error"
                          isLoading={isLoadingDelete}
                          onClick={handleDeleteAccount}
                        >
                          Excluir usuário
                        </Btn>
                        <Btn isLoading={isLoadingUpdate} type="submit">
                          Salvar alterações
                        </Btn>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Container>

      <FooterApp />
    </section>
  );
}
