import { ChevronLeft, DeleteOutline } from "@mui/icons-material";
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
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CardNew } from "~/components/CardNew";
import { LoaderPage } from "~/components/LoaderPage";
import api from "~/services/axios";
import type { IItem } from "~/types/item.type";
import type { IPedido } from "~/types/pedido.type";
import type { IProduto } from "~/types/produto.type";

export function PedidoPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const loteId = searchParams.get("loteId");

  const navigate = useNavigate();

  const [pedido, setPedido] = useState<IPedido>();
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [produtosRestantes, setProdutosRestantes] = useState<IProduto[]>([]);
  const [items, setItems] = useState<Partial<IItem>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  useEffect(() => {
    setProdutosRestantes(
      produtos.filter(
        (prod: IProduto) => !items.some((item) => item.produtoId == prod._id)
      )
    );
  }, [items]);

  const handleChangeItemsList = (index: number, key: string, value: string) => {
    const listToEdit = [...items];
    listToEdit[index] = {
      ...listToEdit[index],
      [key]: value,
    };
    setItems(listToEdit);
  };

  const handleDeleteItem = (index: number) => {
    const listToEdit = [...items];

    listToEdit.splice(index, 1);

    setItems(listToEdit);
  };

  const handleSavePedido = async () => {
    try {
      if (!pedido?.cliente) {
        setErrorMessage("Campo obrigatório");
        return;
      }
      if (items.length == 0) {
        setIsOpenDialog(true);
        return;
      }
      setIsLoading(true);
      if (id) {
        await api.put(`/pedidos/${id}`, { ...pedido, items });
      } else {
        await api.post("/pedidos", { ...pedido, items, loteId });
      }
      navigate(`/lote?id=${loteId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectLote = () => {
    navigate(`/lote?id=${loteId}`);
  };

  const handleAddItem = () => {
    const listToEdit = [...items];
    listToEdit.push({});
    setItems(listToEdit);
  };

  useEffect(() => {
    setIsLoadingPage(true);
    const listPromises = [api.get("/produtos")];

    if (id) {
      listPromises.push(api.get(`/pedidos/${id}`));
    }

    Promise.all(listPromises)
      .then((data) => {
        const [resProdutos, resPedido] = data;
        setProdutos(resProdutos.data);
        setProdutosRestantes(
          resProdutos.data.filter(
            (prod: IProduto) =>
              !resPedido?.data?.items?.some(
                (item: IItem) => item.produtoId == prod._id
              )
          )
        );
        setPedido(resPedido?.data);
        setItems(resPedido?.data?.items || []);
      })
      .finally(() => {
        setIsLoadingPage(false);
      });
  }, []);

  return (
    <section>
      <Container maxWidth="lg" className="mt-4">
        {isLoadingPage ? (
          <LoaderPage />
        ) : (
          <div>
            <div className="flex flex-row items-center gap-4">
              <IconButton color="secondary" onClick={handleRedirectLote}>
                <ChevronLeft fontSize="large" />
              </IconButton>
              <h1>{id ? "Editar pedido" : "Novo pedido"}</h1>
            </div>
            <div className="w-full mt-12">
              <TextField
                label="Cliente"
                value={pedido?.cliente}
                className="w-full"
                error={!!errorMessage}
                onChange={(e) =>
                  setPedido({ ...pedido!, cliente: e.target.value })
                }
              />
              {!!errorMessage ? (
                <div className="mt-1 text-red-500">{errorMessage}</div>
              ) : null}
            </div>

            <h3 className="mt-12 mb-4">Itens</h3>

            <div className="flex flex-col w-full gap-4">
              {items.map((item, index) => (
                <Card sx={{ borderRadius: "16px" }} elevation={0}>
                  <CardContent>
                    <div className="flex flex-row gap-4">
                      <div className="w-full">
                        <Grid container spacing={{ xs: 2, md: 4 }}>
                          <Grid size={8}>
                            <TextField
                              select
                              label="Produto"
                              placeholder="Selecione"
                              value={item.produtoId}
                              className="w-full"
                              color="secondary"
                              onChange={(e) => {
                                handleChangeItemsList(
                                  index,
                                  "produtoId",
                                  e.target.value
                                );
                                if (!e.target.value) {
                                  setErrorMessage("Campo obrigatório");
                                } else {
                                  setErrorMessage(undefined);
                                }
                              }}
                            >
                              {produtos.map((prod) => (
                                <MenuItem
                                  hidden={
                                    !produtosRestantes.some(
                                      (prodRes) => prodRes._id == prod._id
                                    )
                                  }
                                  value={prod._id}
                                >
                                  <span className="text-[#f4f6fc]">
                                    {prod.nome}
                                  </span>
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid size={4}>
                            <TextField
                              label="Qtde"
                              placeholder="0"
                              className="w-full"
                              type="number"
                              value={item.qtde}
                              onChange={(e) =>
                                handleChangeItemsList(
                                  index,
                                  "qtde",
                                  e.target.value
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                      </div>
                      <IconButton
                        color="error"
                        size="large"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {produtosRestantes.length > 0 ? (
                <Card
                  className="p-0 bg-transparent h-full"
                  sx={{ backgroundColor: "#19273170", borderRadius: "16px" }}
                  color="transparent"
                  onClick={handleAddItem}
                >
                  <CardContent className="flex justify-center items-center h-full p-0">
                    <span className={`text-4xl text-[#ff096c]`}>+</span>
                  </CardContent>
                </Card>
              ) : (
                ""
              )}
            </div>

            <div className="flex flex-row gap-4 justify-end my-12">
              <Button
                variant="contained"
                onClick={handleSavePedido}
                loading={isLoading}
                className="w-full max-w-56 min-h-14"
              >
                <b>Salvar</b>
              </Button>
            </div>
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
          {"Estão faltando dados"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span className="text-[#f4f6fc]">
              Você precisa adicionar pelo menos um item na lista
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setIsOpenDialog(false)}
            autoFocus
          >
            <b>OK</b>
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
