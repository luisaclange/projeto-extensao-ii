import { ChevronLeft, DeleteOutline } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
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
  const [items, setItems] = useState<Partial<IItem>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    if (id) {
      await api.put(`/pedidos/${id}`, { ...pedido, items });
    } else {
      await api.post("/pedidos", { ...pedido, items, loteId });
    }
    navigate(`/lote?id=${loteId}`);
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
    setIsLoading(true);
    const listPromises = [api.get("/produtos")];

    if (id) {
      listPromises.push(api.get(`/pedidos/${id}`));
    }

    Promise.all(listPromises)
      .then((data) => {
        const [resProdutos, resPedido] = data;
        setProdutos(resProdutos.data);
        setPedido(resPedido?.data);
        setItems(resPedido?.data?.items || []);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section>
      <Container maxWidth="lg" className="mt-4">
        {isLoading ? (
          <LoaderPage />
        ) : (
          <div>
            <div className="flex flex-row items-center gap-4">
              <IconButton onClick={handleRedirectLote}>
                <ChevronLeft fontSize="large" />
              </IconButton>
              <h1>{id ? pedido?.cliente : "Novo pedido"}</h1>
            </div>
            <div className="w-full mt-12">
              <TextField
                label="Cliente"
                value={pedido?.cliente}
                className="w-full"
                onChange={(e) =>
                  setPedido({ ...pedido!, cliente: e.target.value })
                }
              />
            </div>

            <h3 className="mt-12 mb-4">Itens</h3>

            <div className="flex flex-col w-full gap-4">
              {items.map((item, index) => (
                <Card>
                  <CardContent>
                    <Grid container spacing={4}>
                      <Grid size={7}>
                        <Select
                          label="Produto"
                          value={item.produtoId}
                          className="w-full"
                          onChange={(e) =>
                            handleChangeItemsList(
                              index,
                              "produtoId",
                              e.target.value
                            )
                          }
                        >
                          {produtos.map((prod) => (
                            <MenuItem value={prod._id}>{prod.nome}</MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={4}>
                        <TextField
                          label="Quantidade"
                          className="w-full"
                          type="number"
                          value={item.qtde}
                          onChange={(e) =>
                            handleChangeItemsList(index, "qtde", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid size={1}>
                        <div className="flex justify-center items-center w-full h-full">
                          <IconButton
                            color="error"
                            size="large"
                            onClick={() => handleDeleteItem(index)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </div>
                      </Grid>
                    </Grid>
                    <div className="flex flex-row gap-4"></div>
                  </CardContent>
                </Card>
              ))}

              <Card
                className={` opacity-60 p-0 w-full h-full`}
                onClick={handleAddItem}
              >
                <CardContent className="flex justify-center items-center h-full p-0">
                  <span className="text-4xl text-[#d7586d]">+</span>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-row gap-4 justify-end my-12">
              <Button variant="contained" onClick={handleSavePedido}>
                Salvar
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
