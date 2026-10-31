import {
  Cancel,
  CheckCircle,
  Delete,
  Edit,
  RemoveCircle,
} from "@mui/icons-material";
import { Card, CardContent, Grid, IconButton, Tooltip } from "@mui/material";
import { EStatusUsuario, type IUsuario } from "~/types/usuario.type";
import { formatCPF } from "~/utils/formatCPF";

export function CardUsuario({
  item,
  handleDelete,
  statusDescription,
  handleEdit,
  isLoadingDelete,
}: {
  item: IUsuario;
  handleDelete: (item: IUsuario) => void;
  statusDescription: (status: EStatusUsuario) => string;
  handleEdit: (item: IUsuario) => void;
  isLoadingDelete: boolean;
}) {
  return (
    <Card key={item.id}>
      <CardContent>
        <div className="hidden md:block">
          <Grid container spacing={4}>
            <Grid size={1} className="self-center">
              <div
                className={
                  (item.status == EStatusUsuario.ativo
                    ? "text-green-400"
                    : item.status == EStatusUsuario.recusado
                      ? "text-red-400"
                      : "text-yellow-300") +
                  " w-full flex flex-row justify-center"
                }
              >
                <Tooltip title={statusDescription(item.status)}>
                  {item.status == EStatusUsuario.ativo ? (
                    <CheckCircle />
                  ) : item.status == EStatusUsuario.recusado ? (
                    <Cancel />
                  ) : (
                    <RemoveCircle />
                  )}
                </Tooltip>
              </div>
            </Grid>

            <Grid size={6} className="text-white self-center">
              {item.nome}
            </Grid>
            <Grid size={3} className="text-white self-center">
              {formatCPF(item.cpf)}
            </Grid>

            <Grid size={2}>
              <IconButton onClick={() => handleEdit(item)}>
                <Edit className="text-blue-400" />
              </IconButton>
              <IconButton
                loading={isLoadingDelete}
                onClick={() => handleDelete(item)}
              >
                <Delete className="text-red-400" />
              </IconButton>
            </Grid>
          </Grid>
        </div>
        <div className="flex-row gap-4 flex md:hidden">
          <div
            className={
              (item.status == EStatusUsuario.ativo
                ? "text-green-400"
                : item.status == EStatusUsuario.recusado
                  ? "text-red-400"
                  : "text-yellow-300") +
              " w-fit flex flex-row justify-center mt-1"
            }
          >
            {item.status == EStatusUsuario.ativo ? (
              <CheckCircle />
            ) : item.status == EStatusUsuario.recusado ? (
              <Cancel />
            ) : (
              <RemoveCircle />
            )}
          </div>
          <div className="text-white flex flex-col w-full">
            <b className="text-lg">{item.nome}</b>
            <span>{formatCPF(item.cpf)}</span>
            <span className="mt-1 text-sm">
              {statusDescription(item.status)}
            </span>
          </div>
          <div className="flex flex-col">
            <IconButton onClick={() => handleEdit(item)}>
              <Edit className="text-blue-400" />
            </IconButton>
            <IconButton
              loading={isLoadingDelete}
              onClick={() => handleDelete(item)}
            >
              <Delete className="text-red-400" />
            </IconButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
