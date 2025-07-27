import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "~/services/axios";
import type { ILote } from "~/types/lote.type";
import type { IProduto } from "~/types/produto.type";

export function HomePage() {
  const [lotes, setLotes] = useState<ILote[]>([]);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDialogNewLote, setIsOpenDialogNewLote] = useState(false);
  const [newLote, setNewLote] = useState<Partial<ILote>>();

  const navigate = useNavigate();

  const handleRedirectLote = (id?: string) => {
    navigate(`/lote${id ? `?id=${id}` : ""}`);
  };

  const handleRedirectProduto = (id?: string) => {
    navigate(`/produto${id ? `?id=${id}` : ""}`);
  };

  const handleCreateLote = async () => {
    const response = await api.post("/lotes", newLote);
    navigate(`/lote?id=${response.data?.id}`);
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([api.get("/lotes"), api.get("/produtos")])
      .then((data) => {
        const [resLotes, resProdutos] = data;
        setLotes(resLotes.data);
        setProdutos(resProdutos.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section>
      <div className="bg-gray-500">
        <Container
          maxWidth="lg"
          className="py-4 flex justify-between items-center"
        >
          <h1>Home</h1>
        </Container>
      </div>

      <Container maxWidth="lg" className="mt-4">
        {isLoading ? (
          <span>Carregando</span>
        ) : (
          <div className="flex flex-col gap-4">
            <h2>Lotes</h2>

            <Grid container spacing={4}>
              {lotes.map((item) => (
                <Grid size={4}>
                  <Card>
                    <CardContent className="p-4 bg-gray-500 flex justify-between">
                      <div className="flex flex-col">
                        <p>{item.titulo}</p>
                        <p>
                          {item.data_inicio} à {item.data_fim}
                        </p>
                      </div>
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => handleRedirectLote(item.id)}
                        >
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              <Grid size={4}>
                <Card onClick={() => setIsOpenDialogNewLote(true)}>
                  <CardContent className=" bg-gray-500 flex justify-between">
                    Novo lote
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <h2>Produtos</h2>

            <Grid container spacing={4}>
              {produtos.map((item) => (
                <Grid size={4}>
                  <Card>
                    <CardContent className="p-4 bg-gray-500 flex justify-between">
                      <div className="flex flex-col">
                        <p>{item.nome}</p>
                      </div>
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => handleRedirectProduto(item.id)}
                        >
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              <Grid size={4}>
                <Card onClick={() => handleRedirectProduto()}>
                  <CardContent className=" bg-gray-500 flex justify-between">
                    Novo produto
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        )}
      </Container>

      <Dialog
        open={isOpenDialogNewLote}
        onClose={() => setIsOpenDialogNewLote(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Novo lote"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              value={newLote?.titulo}
              onChange={(e) => setNewLote({ titulo: e.target.value })}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenDialogNewLote(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateLote} autoFocus>
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
