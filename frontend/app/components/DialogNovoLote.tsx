import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import api from "~/services/axios";
import type { ILote } from "~/types/lote.type";

export function DialogNovoLote({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const [newLote, setNewLote] = useState<Partial<ILote>>();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreateLote = async () => {
    try {
      setIsLoading(true);
      const response = await api.post("/lotes", newLote);
      navigate(`/lote?id=${response.data?._id}&edit=true`);
    } catch (error) {
      setIsLoading(false);
    }
  };

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
        <b>Novo lote</b>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className="py-4">
          <TextField
            label="Titulo"
            value={newLote?.titulo}
            className="w-full"
            onChange={(e) => setNewLote({ titulo: e.target.value })}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
        <Button
          loading={isLoading}
          variant="contained"
          onClick={handleCreateLote}
          autoFocus
        >
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
