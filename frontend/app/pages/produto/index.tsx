import { ChevronLeft } from "@mui/icons-material";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LoaderPage } from "~/components/LoaderPage";
import api from "~/services/axios";
import type { IProduto } from "~/types/produto.type";

export function ProdutoPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const navigate = useNavigate();

  const [produto, setProduto] = useState<IProduto>();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleSaveProduto = async () => {
    if (id) {
      await api.put(`/produtos/${id}`, produto);
    } else {
      await api.post(`/produtos`, produto);
    }

    navigate("/");
  };

  const handleDeleteProduto = async () => {
    setIsOpenDialog(false);
    await api.delete(`/produtos/${id}`);
    navigate("/");
  };

  const handleRedirectHome = () => {
    navigate("/");
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      Promise.all([api.get(`/produtos/${id}`)])
        .then((data) => {
          const [resProduto] = data;
          setProduto(resProduto.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <section>
      <Container maxWidth="lg" className="mt-4">
        {isLoading ? (
          <LoaderPage />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-row items-center gap-4">
              <IconButton onClick={handleRedirectHome}>
                <ChevronLeft fontSize="large" />
              </IconButton>
              <h1>{produto?.nome || "Novo produto"}</h1>
            </div>

            <Grid container spacing={4}>
              <Grid size={12} className="flex flex-col">
                <TextField
                  label="Nome"
                  value={produto?.nome}
                  onChange={(e) =>
                    setProduto({ ...produto!, nome: e.target.value })
                  }
                />
              </Grid>

              <Grid size={12}>
                <div className="flex flex-row justify-between">
                  {id ? (
                    <Button onClick={() => setIsOpenDialog(true)}>
                      Excluir
                    </Button>
                  ) : (
                    <div />
                  )}
                  <div className="flex flex-row gap-4">
                    <Button variant="contained" onClick={handleSaveProduto}>
                      Salvar
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        )}
      </Container>

      <Dialog
        open={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Tem certeza de que deseja excluir esse produto?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você não poderá mais usá-lo
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleDeleteProduto} autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
