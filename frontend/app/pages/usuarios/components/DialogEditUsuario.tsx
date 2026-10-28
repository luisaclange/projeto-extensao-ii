import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Input } from "~/components/Input";
import { useAlert } from "~/context/AlertContext";
import api from "~/services/axios";
import { EStatusUsuario, type IUsuario } from "~/types/usuario.type";
import { validateCPF } from "~/utils/validateCPF";
import { validateRules } from "~/utils/validateRules";

export function DialogEditUsuario({
  isOpen,
  setIsOpen,
  usuario,
  updateUsuario,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  usuario?: IUsuario;
  updateUsuario: (usuario: IUsuario) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [editUsuario, setEditUsuario] = useState<Partial<IUsuario>>({});

  const { showAlert } = useAlert();

  const rules = {
    nome: [(value?: string) => !!value || "Campo obrigatório"],
    cpf: [
      (value?: string) => !!value || "Campo obrigatório",
      (value?: string) => validateCPF(value!) || "CPF inválido",
    ],
    status: [
      (value?: number) => typeof value == "number" || "Campo obrigatório",
    ],
  };

  const handleEditUsuario = async () => {
    try {
      setIsLoading(true);
      const isValid = validateRules(
        {
          nome: editUsuario.nome,
          cpf: editUsuario.cpf,
          status: editUsuario.status,
        },
        rules,
      );
      if (!isValid) return;
      await api.put(`/usuarios/${usuario!.id}`, {
        nome: editUsuario.nome,
        cpf: editUsuario.cpf?.replace(/\D/g, ""),
        status: editUsuario.status,
      });
      updateUsuario(editUsuario as IUsuario);
      setIsOpen(false);
      showAlert({
        variant: "success",
        title: "Usuário alterado com sucesso!",
        message: `As alterações nos dados do usuário ${editUsuario?.nome} foram aplicadas com sucesso!`,
      });
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    if (isOpen && usuario) {
      setEditUsuario(usuario);
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        <b>Editar usuário</b>
      </DialogTitle>
      <DialogContent id="alert-dialog-description">
        <div className="py-4 flex flex-col gap-4">
          <Input
            label="Nome"
            placeholder="Nome completo"
            value={editUsuario.nome}
            setValue={(value?: string) =>
              setEditUsuario({ ...editUsuario, nome: value! })
            }
            rules={rules.nome}
          />
          <Input
            label="CPF"
            placeholder="000.000.000-00"
            value={editUsuario.cpf}
            setValue={(value?: string) =>
              setEditUsuario({ ...editUsuario, cpf: value! })
            }
            mask="cpf"
            rules={rules.cpf}
          />
          <Input
            label="Status"
            placeholder="Selecione"
            value={editUsuario.status}
            setValue={(value?: number) =>
              setEditUsuario({ ...editUsuario, status: value! })
            }
            rules={rules.status}
            select
            selectValues={[
              {
                label: "Ativo",
                value: EStatusUsuario.ativo,
              },
              {
                label: "Pendente",
                value: EStatusUsuario.pendente,
              },
              {
                label: "Bloqueado",
                value: EStatusUsuario.recusado,
              },
            ]}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <div className="w-full flex flex-row justify-between p-2">
          <Button variant="outlined" onClick={() => setIsOpen(false)}>
            <b>Cancelar</b>
          </Button>
          <Button
            loading={isLoading}
            variant="contained"
            onClick={handleEditUsuario}
            autoFocus
          >
            <b>Salvar</b>
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
