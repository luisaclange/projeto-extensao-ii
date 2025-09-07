import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import api from "~/services/axios";
import type { ILote } from "~/types/lote.type";
import type { IPedido } from "~/types/pedido.type";
import type { IProduto } from "~/types/produto.type";

export function LotePage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const navigate = useNavigate();

  const [lote, setLote] = useState<ILote>();
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [resume, setResume] = useState<
    {
      produto: string;
      qtde: number;
    }[]
  >([]);

  const handleSaveLote = async () => {
    await api.put(`/lotes/${id}`, lote);

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
      Promise.all([
        api.get(`/lotes/${id}`),
        api.get(`/pedidos?loteId=${id}`),
        api.get("/produtos"),
      ])
        .then((data) => {
          const [resLote, resPedidos, resProdutos] = data;
          setLote(resLote.data);
          setPedidos(resPedidos.data);
          setProdutos(resProdutos.data);
          getResume(resProdutos.data, resPedidos.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <section>
      <div className="bg-gray-500">
        <Container
          maxWidth="lg"
          className="py-4 flex justify-between items-center"
        >
          <h1>Lote</h1>
        </Container>
      </div>

      <Container maxWidth="lg" className="mt-4">
        {isLoading ? (
          <span>Carregando...</span>
        ) : (
          <div>
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

            <Divider />

            {resume.map((item) => (
              <div>
                <span>{item.produto}</span>
                <span>{item.qtde}</span>
              </div>
            ))}

            <Divider />

            <h3>Pedidos</h3>

            <Grid container spacing={4}>
              {pedidos.map((item) => (
                <Grid size={4}>
                  <Card>
                    <CardContent className="flex justify-between">
                      <div className="flex flex-col">
                        <p>{item.cliente}</p>
                      </div>

                      <div>
                        <Button onClick={() => handleRedirectPedido(item._id)}>
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              <Grid size={4}>
                <Card onClick={() => handleRedirectPedido()}>
                  <CardContent className="flex justify-between">
                    Novo pedido
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        )}
      </Container>
    </section>
  );
}
