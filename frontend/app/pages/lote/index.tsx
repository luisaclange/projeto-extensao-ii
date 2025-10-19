import {
  BarChart,
  CalendarMonth,
  ChevronLeft,
  Edit,
  Favorite,
  FavoriteBorder,
  ReceiptLong,
  Sell,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
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
import { parseDate } from "~/utils/parseDate";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHeart, setIsLoadingHeart] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [resume, setResume] = useState<
    {
      produto: string;
      qtde: number;
    }[]
  >([]);
  const [isEdit, setIsEdit] = useState<boolean>(edit == "true");
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSaveLote = async () => {
    try {
      if (!lote?.titulo) {
        setErrorMessage("Campo obrigatório");
      }
      setIsLoading(true);
      await api.put(`/lotes/${id}`, lote);
      setIsEdit(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      setIsLoadingHeart(true);
      await api.put(`/lotes/${id}`, { favorito: !lote?.favorito });
      setLote({
        ...lote!,
        favorito: !lote?.favorito!,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingHeart(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleRedirectPedido = (idPedido?: string) => {
    navigate(`/pedido?loteId=${id}${idPedido ? `&id=${idPedido}` : ""}`);
  };

  const getResume = (dataProdutos: IProduto[], dataPedidos: IPedido[]) => {
    const data = dataProdutos
      .map((produto) => {
        return {
          produto: produto.nome,
          qtde: dataPedidos.reduce((count: number, pedido) => {
            pedido.items.forEach((item) => {
              if (item.produtoId == produto.id) {
                count += Number(item.qtde);
              }
            });
            return count;
          }, 0),
        };
      })
      .filter((produto) => produto.qtde > 0);

    setResume(data);
  };

  useEffect(() => {
    if (id) {
      setIsLoadingPage(true);
      Promise.all([api.get(`/lotes/${id}`), api.get("/produtos")])
        .then((data) => {
          const [resLote, resProdutos] = data;
          setLote(resLote.data);
          setProdutos(resProdutos.data);
          getResume(resProdutos.data, resLote.data.pedidos);
        })
        .finally(() => {
          setIsLoadingPage(false);
        });
    }
  }, []);

  return (
    <section>
      <Container maxWidth="lg" className="my-4">
        {isLoadingPage ? (
          <LoaderPage />
        ) : (
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                  <IconButton onClick={handleBack}>
                    <ChevronLeft fontSize="large" color="secondary" />
                  </IconButton>
                  <h1>{lote?.titulo}</h1>
                </div>
                <div className="flex flex-row gap-2">
                  <IconButton
                    color="primary"
                    className="h-fit"
                    onClick={handleFavorite}
                  >
                    {isLoadingHeart ? (
                      <CircularProgress size="1rem" />
                    ) : lote?.favorito ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                  <IconButton
                    className="h-fit"
                    color="secondary"
                    onClick={() => setIsEdit(!isEdit)}
                  >
                    <Edit />
                  </IconButton>
                </div>
              </div>
              {isEdit ? (
                <div className="pt-8">
                  <Grid container spacing={{ xs: 2, md: 4 }}>
                    <Grid size={12} className="flex flex-col">
                      <TextField
                        value={lote?.titulo}
                        label="Titulo"
                        placeholder="Digite aqui"
                        color="secondary"
                        onChange={(e) => {
                          setLote({ ...lote!, titulo: e.target.value });
                          if (!e.target.value) {
                            setErrorMessage("Campo obrigatório");
                          } else {
                            setErrorMessage(undefined);
                          }
                        }}
                        error={!!errorMessage}
                      />
                      {!!errorMessage ? (
                        <div className="mt-1 text-red-500">{errorMessage}</div>
                      ) : null}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }} className="flex flex-col">
                      <TextField
                        label="Data início"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={lote?.data_inicio}
                        color="secondary"
                        onChange={(e) =>
                          setLote({ ...lote!, data_inicio: e.target.value })
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }} className="flex flex-col">
                      <TextField
                        label="Data fim"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={lote?.data_fim}
                        color="secondary"
                        onChange={(e) =>
                          setLote({ ...lote!, data_fim: e.target.value })
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }} className="flex flex-col">
                      <Button
                        className="h-full min-h-14"
                        variant="contained"
                        loading={isLoading}
                        onClick={handleSaveLote}
                      >
                        <b>Salvar</b>
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              ) : !!lote?.data_fim && !!lote?.data_inicio ? (
                <div className="flex flex-row gap-4">
                  <CalendarMonth className="mr-2" />
                  <b>{`${parseDate(lote.data_inicio)} à ${parseDate(lote.data_fim)}`}</b>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {resume.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4 border-b-2 border-dashed pb-2">
                  <BarChart />
                  <h2>Resumo</h2>
                </div>

                <Grid container spacing={{ xs: 2, md: 4 }}>
                  {resume.map((item) => (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card
                        className="w-full rounded-2xl"
                        sx={{ borderRadius: "16px", height: "auto" }}
                        elevation={0}
                      >
                        <CardContent className="p-0">
                          <div className="flex  flex-row justify-between text-[#f4f6fc] w-full align-middle items-center h-full">
                            <div className="flex flex-row gap-2 items-center">
                              <Sell />
                              <b className="text-lg">{item.produto}</b>
                            </div>
                            <b className="text-xl">{item.qtde}</b>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            ) : null}

            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4 border-b-2 border-dashed pb-2">
                <ReceiptLong />
                <h2>Pedidos</h2>
              </div>

              <Grid container spacing={{ xs: 2, md: 4 }}>
                {lote?.pedidos.map((item) => (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <CardPedido item={item} loteId={id!} produtos={produtos} />
                  </Grid>
                ))}

                <Grid size={{ xs: 12, md: 4 }}>
                  <CardNew handleClick={() => handleRedirectPedido()} />
                </Grid>
              </Grid>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
