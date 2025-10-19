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
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSaveProduto = async () => {
    try {
      if (!produto?.nome) {
        setErrorMessage("Campo obrigatório");
        return;
      }

      if (id) {
        await api.put(`/produtos/${id}`, produto);
      } else {
        await api.post(`/produtos`, produto);
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
      setIsLoadingPage(true);
      Promise.all([api.get(`/produtos/${id}`)])
        .then((data) => {
          const [resProduto] = data;
          setProduto(resProduto.data);
        })
        .finally(() => {
          setIsLoadingPage(false);
        });
    }
  }, []);

  return (
    <section>
      <Container maxWidth="lg" className="mt-4">
        {isLoadingPage ? (
          <LoaderPage />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-row items-center gap-4">
              <IconButton color="secondary" onClick={handleRedirectHome}>
                <ChevronLeft fontSize="large" />
              </IconButton>
              <h1>{id ? "Editar produto" : "Novo produto"}</h1>
            </div>

            <Grid container spacing={{ xs: 2, md: 4 }}>
              <Grid size={12} className="flex flex-col">
                <TextField
                  label="Nome"
                  error={!!errorMessage}
                  value={produto?.nome}
                  onChange={(e) => {
                    setProduto({ ...produto!, nome: e.target.value });
                    if (!e.target.value) {
                      setErrorMessage("Campo obrigatório");
                    } else {
                      setErrorMessage(undefined);
                    }
                  }}
                />
                {!!errorMessage ? (
                  <div className="mt-1 text-red-500">{errorMessage}</div>
                ) : null}
              </Grid>

              <Grid size={12}>
                <div className="flex flex-col gap-4 md:flex-row justify-between">
                  <Button
                    hidden={!id}
                    className="w-full md:max-w-56 min-h-14"
                    variant="outlined"
                    onClick={() => setIsOpenDialog(true)}
                  >
                    Excluir
                  </Button>
                  <Button
                    variant="contained"
                    className="w-full md:max-w-56 min-h-14"
                    loading={isLoading}
                    onClick={handleSaveProduto}
                  >
                    <b>Salvar</b>
                  </Button>
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
            <span className="text-[#f4f6fc]">Você não poderá mais usá-lo</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenDialog(false)}>
            <b>Cancelar</b>
          </Button>
          <Button variant="contained" onClick={handleDeleteProduto} autoFocus>
            <b>Sim</b>
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
