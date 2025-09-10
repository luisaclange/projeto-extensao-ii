import {
  CalendarMonth,
  ChevronLeft,
  Edit,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CardNew } from "~/components/CardNew";
import { CardPedido } from "~/components/CardPedido";
import { LoaderPage } from "~/components/LoaderPage";
import api from "~/services/axios";
import type { ILote } from "~/types/lote.type";
import type { IPedido } from "~/types/pedido.type";
import type { IProduto } from "~/types/produto.type";

interface IResLote extends ILote {
  createdAt: Date;
  updatedAt: Date;
  pedidos: IPedido[];
}

export function LotePage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const edit = searchParams.get("edit");

  const navigate = useNavigate();

  const [lote, setLote] = useState<IResLote>();
  const [isLoading, setIsLoading] = useState(true);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [resume, setResume] = useState<
    {
      produto: string;
      qtde: number;
    }[]
  >([]);
  const [isEdit, setIsEdit] = useState<boolean>(edit == "true");

  const handleSaveLote = async () => {
    await api.put(`/lotes/${id}`, lote);
    setIsEdit(false);
  };

  const handleFavorite = async () => {
    try {
      await api.put(`/lotes/${id}`, { favorito: !lote?.favorito });
      setLote({
        ...lote!,
        favorito: !lote?.favorito!,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleRedirectPedido = (idPedido?: string) => {
    navigate(`/pedido?loteId=${id}${idPedido ? `&id=${idPedido}` : ""}`);
  };

  const getResume = (dataProdutos: IProduto[], dataPedidos: IPedido[]) => {
    const data = dataProdutos.map((produto) => {
      return {
        produto: produto.nome,
        qtde: dataPedidos.reduce((count: number, pedido) => {
          pedido.items.forEach((item) => {
            if (item.produtoId == produto._id) {
              count += Number(item.qtde);
            }
          });
          return count;
        }, 0),
      };
    });

    setResume(data);
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      Promise.all([api.get(`/lotes/${id}`), api.get("/produtos")])
        .then((data) => {
          const [resLote, resProdutos] = data;
          setLote(resLote.data);
          setProdutos(resProdutos.data);
          getResume(resProdutos.data, resLote.data.pedidos);
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
          <div>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-4">
                <IconButton onClick={handleBack}>
                  <ChevronLeft fontSize="large" />
                </IconButton>
                <h1>{lote?.titulo}</h1>
              </div>
              <div className="flex flex-row gap-2">
                <IconButton
                  color="primary"
                  className="h-fit"
                  onClick={handleFavorite}
                >
                  {isLoading ? (
                    <CircularProgress size="1rem" />
                  ) : lote?.favorito ? (
                    <Favorite />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                <IconButton
                  className="h-fit"
                  onClick={() => setIsEdit(!isEdit)}
                >
                  <Edit />
                </IconButton>
              </div>
            </div>
            {isEdit ? (
              <div className="pt-8">
                <Grid container spacing={4}>
                  <Grid size={12} className="flex flex-col">
                    <TextField
                      value={lote?.titulo}
                      label="Titulo"
                      onChange={(e) =>
                        setLote({ ...lote!, titulo: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid size={4} className="flex flex-col">
                    <TextField
                      label="Data início"
                      value={lote?.data_inicio}
                      onChange={(e) =>
                        setLote({ ...lote!, data_inicio: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid size={4} className="flex flex-col">
                    <TextField
                      label="Data fim"
                      value={lote?.data_fim}
                      onChange={(e) =>
                        setLote({ ...lote!, data_fim: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid size={4} className="flex flex-col">
                    <Button onClick={handleSaveLote}>Salvar</Button>
                  </Grid>
                </Grid>
              </div>
            ) : (
              <div className="flex flex-row gap-4 p-4">
                <CalendarMonth className="mr-2" />
                <b>
                  {!!lote?.data_fim && !!lote?.data_inicio
                    ? `${lote.data_inicio} à ${lote.data_fim}`
                    : "----"}
                </b>
              </div>
            )}

            <h3 className="mt-8 mb-4">Resumo</h3>

            <Grid container spacing={4}>
              {resume.map((item) => (
                <Grid size={6}>
                  <Card>
                    <CardContent>
                      <div className="flex flex-row justify-between w-full align-middle items-center">
                        <b className="text-lg">{item.produto}</b>
                        <span className="text-xl">{item.qtde}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <h3 className="mt-8 mb-4">Pedidos</h3>

            <Grid container spacing={4}>
              {lote?.pedidos.map((item) => (
                <Grid size={4}>
                  <CardPedido item={item} loteId={id!} produtos={produtos} />
                </Grid>
              ))}

              <Grid size={4}>
                <CardNew handleClick={() => handleRedirectPedido()} />
              </Grid>
            </Grid>
          </div>
        )}
      </Container>
    </section>
  );
}
