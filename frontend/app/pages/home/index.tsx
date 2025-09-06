import {
  CalendarMonth,
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
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
      <Container maxWidth="lg" className="mt-4">
        {isLoading ? (
          <span>Carregando</span>
        ) : (
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4">
              <h2>Lotes</h2>

              <Grid container spacing={4}>
                {lotes.map((item) => (
                  <Grid size={4} key={item.id}>
                    <Card className="border-2 border-[#eed0d5]">
                      <CardContent className="p-4 flex flex-row justify-between gap-4">
                        <div className="flex flex-col gap-4">
                          <h3>{item.titulo}</h3>
                          {!!item.data_fim && !!item.data_inicio ? (
                            <p className="text-pink-50 text-sm">
                              <CalendarMonth className="mr-2" />
                              <b>
                                {item.data_inicio} à {item.data_fim}
                              </b>
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="flex flex-col justify-end gap-2">
                          <Button
                            color="success"
                            onClick={() => handleRedirectLote(item.id)}
                          >
                            {item.favorito ? <Favorite /> : <FavoriteBorder />}
                          </Button>

                          <Button
                            color="info"
                            onClick={() => handleRedirectLote(item.id)}
                          >
                            <Edit />
                          </Button>

                          <Button
                            color="error"
                            onClick={() => handleRedirectLote(item.id)}
                          >
                            <Delete />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                <Grid size={4}>
                  <Card
                    className="border-2 border-[#eed0d5] border-dotted h-full"
                    onClick={() => setIsOpenDialogNewLote(true)}
                  >
                    <CardContent className="flex justify-center items-center h-full">
                      <span className="text-9xl text-[#d7586d]">+</span>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>

            <div className="flex flex-col gap-4">
              <h2>Produtos</h2>

              <Grid container spacing={4}>
                {produtos.map((item) => (
                  <Grid size={4}>
                    <Card>
                      <CardContent className="p-4 flex justify-between">
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
                  <Card
                    className="border-2 border-[#eed0d5] border-dotted h-full"
                    onClick={() => handleRedirectProduto()}
                  >
                    <CardContent className="flex justify-center items-center h-full">
                      <span className="text-9xl text-[#d7586d]">+</span>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </div>
        )}
      </Container>

      <Dialog
        open={isOpenDialogNewLote}
        onClose={() => setIsOpenDialogNewLote(false)}
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
          <Button onClick={() => setIsOpenDialogNewLote(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleCreateLote} autoFocus>
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
