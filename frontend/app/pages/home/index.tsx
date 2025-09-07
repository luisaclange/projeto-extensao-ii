import { Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "~/services/axios";
import type { ILote } from "~/types/lote.type";
import type { IProduto } from "~/types/produto.type";
import { CardLote } from "~/components/CardLote";
import { CardProduto } from "~/components/CardProduto";
import { DialogNovoLote } from "~/components/DialogNovoLote";
import { CardNew } from "~/components/CardNew";
import { LoaderPage } from "~/components/LoaderPage";

export interface IResLote extends ILote {
  createdAt?: string | number | Date;
  numeroPedidos?: number;
  numeroItems?: number;
}

export function HomePage() {
  const [lotes, setLotes] = useState<IResLote[]>([]);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDialogNewLote, setIsOpenDialogNewLote] = useState(false);

  const navigate = useNavigate();

  const handleRedirectProduto = (id?: string) => {
    navigate(`/produto${id ? `?id=${id}` : ""}`);
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
      <Container maxWidth="lg" className="my-4">
        {isLoading ? (
          <LoaderPage />
        ) : (
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4">
              <h2>Lotes</h2>

              <Grid container spacing={4}>
                {lotes
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt!).getTime() -
                      new Date(b.createdAt!).getTime()
                  )
                  .sort((a, b) => Number(b.favorito) - Number(a.favorito))
                  .map((item) => (
                    <Grid size={4} key={item._id}>
                      <CardLote
                        item={item}
                        setItem={(value: Partial<ILote>) => {
                          setLotes(
                            lotes.map((lote) =>
                              lote._id == item._id
                                ? { ...item, ...value }
                                : lote
                            )
                          );
                        }}
                      />
                    </Grid>
                  ))}

                <Grid size={4}>
                  <CardNew handleClick={() => setIsOpenDialogNewLote(true)} />
                </Grid>
              </Grid>
            </div>

            <div className="flex flex-col gap-4">
              <h2>Produtos</h2>

              <Grid container spacing={4}>
                {produtos.map((item) => (
                  <Grid size={4}>
                    <CardProduto item={item} />
                  </Grid>
                ))}

                <Grid size={4}>
                  <CardNew
                    handleClick={() => handleRedirectProduto()}
                    size="16"
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        )}
      </Container>

      <DialogNovoLote
        isOpen={isOpenDialogNewLote}
        setIsOpen={setIsOpenDialogNewLote}
      />
    </section>
  );
}
