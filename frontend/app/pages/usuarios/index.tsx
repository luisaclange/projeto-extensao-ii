import { Container, Grid, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import type { ILote } from "~/types/lote.type";
import { LoaderPage } from "~/components/LoaderPage";
import { ChevronLeft, Search } from "@mui/icons-material";
import { AppBar } from "~/components/AppBar";
import { useNavigate } from "react-router";
import { EStatusUsuario, type IUsuario } from "~/types/usuario.type";
import { formatCPF } from "~/utils/formatCPF";
import { Input } from "~/components/Input";
import { useAlert } from "~/context/AlertContext";
import api from "~/services/axios";
import { CardUsuario } from "./components/CardUsuario";
import { DialogEditUsuario } from "./components/DialogEditUsuario";

export interface IResLote extends ILote {
  createdAt?: string | number | Date;
  numeroPedidos?: number;
  numeroItems?: number;
}

export function UsuariosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<Array<IUsuario>>([]);
  const [rows, setRows] = useState<Array<IUsuario>>([]);
  const [filter, setFilter] = useState<string>();
  const [isOpenDialogEditUsuario, setIsOpenDialogEditUsuario] = useState(false);
  const [editUsuario, setEditUsuario] = useState<IUsuario>();

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleBack = () => {
    navigate("/");
  };

  const statusDescription = (value: EStatusUsuario) => {
    switch (value) {
      case EStatusUsuario.ativo:
        return "Ativo";
      case EStatusUsuario.pendente:
        return "Pendente";
      case EStatusUsuario.recusado:
        return "Bloqueado";
      default:
        return "";
    }
  };

  const handleDelete = (user: IUsuario) => {
    showAlert({
      title: "Deletar usuário",
      message: `Você tem certeza de que deseja deletar o usuário ${user.nome}? Esta ação é irreversível.`,
      labelLeftButton: "Não",
      onClickLeftButton: () => {},
      labelRightButton: "Sim",
      onClickRightButton: async () => {
        try {
          setIsLoading(true);
          api.delete(`/usuarios/${user.id}`);
          setUsuarios(usuarios.filter((item) => item.id != user.id));
          setRows(rows.filter((item) => item.id != user.id));
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
      },
    });
  };

  const handleEdit = (usuario: IUsuario) => {
    setEditUsuario(usuario);
    setIsOpenDialogEditUsuario(true);
  };

  const updateUsuario = (usuario: IUsuario) => {
    const filterUsuarios = usuarios.filter((item) => item.id != usuario.id);
    setUsuarios([...filterUsuarios, usuario]);
    const filterRows = rows.filter((item) => item.id != usuario.id);
    setRows([...filterRows, usuario]);
  };

  useEffect(() => {
    if (filter && filter?.length > 0) {
      setRows(
        usuarios.filter(
          (item) =>
            item.nome.toLowerCase().includes(filter?.toLowerCase()) ||
            item.cpf?.includes(filter) ||
            formatCPF(item.cpf)?.includes(filter) ||
            statusDescription(item.status)
              .toLowerCase()
              .includes(filter?.toLowerCase()),
        ),
      );
    } else {
      setRows(usuarios);
    }
  }, [filter]);

  useEffect(() => {
    api
      .get("/usuarios")
      .then((data) => {
        const resUsuarios = data.data as IUsuario[];
        setUsuarios(resUsuarios);
        setRows(resUsuarios);
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
                <h2>Usuários</h2>
              </div>

              <div className="mt-6 flex flex-row w-full items-center gap-4">
                <Search />
                <div className="w-full">
                  <Input
                    label="Busque por um usuário"
                    setValue={setFilter}
                    value={filter}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <div className="hidden md:block mx-4">
                  <Grid container spacing={4}>
                    <Grid size={1}>
                      <b>Status</b>
                    </Grid>
                    <Grid size={6}>
                      <b>Nome</b>
                    </Grid>
                    <Grid size={3}>
                      <b>CPF</b>
                    </Grid>
                    <Grid size={2}>
                      <b>Ações</b>
                    </Grid>
                  </Grid>
                </div>

                {rows
                  .sort((a, b) => a.nome.localeCompare(b.nome))
                  .sort((a, b) => a.status - b.status)
                  .map((row) => (
                    <CardUsuario
                      key={row.id}
                      item={row}
                      handleDelete={(value) => handleDelete(value)}
                      statusDescription={(value) => statusDescription(value)}
                      handleEdit={(value) => handleEdit(value)}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        <DialogEditUsuario
          isOpen={isOpenDialogEditUsuario}
          setIsOpen={setIsOpenDialogEditUsuario}
          usuario={editUsuario}
          updateUsuario={updateUsuario}
        />
      </Container>
    </section>
  );
}
