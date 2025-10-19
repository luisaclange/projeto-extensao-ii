import { Sell } from "@mui/icons-material";
import { Button, Card, CardContent, Divider } from "@mui/material";
import { useNavigate } from "react-router";
import type { IPedido } from "~/types/pedido.type";
import type { IProduto } from "~/types/produto.type";

export function CardPedido({
  item,
  loteId,
  produtos,
}: {
  item: IPedido;
  loteId: string;
  produtos: IProduto[];
}) {
  const navigate = useNavigate();

  const handleRedirectPedido = (idPedido?: string) => {
    navigate(`/pedido?loteId=${loteId}&id=${idPedido}`);
  };

  return (
    <Card
      className="h-full min-h-48 w-full rounded-2xl"
      sx={{ borderRadius: "16px" }}
      onClick={() => handleRedirectPedido(item.id)}
    >
      <CardContent className="p-4 flex flex-row justify-between gap-4">
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-[#f4f6fc]">{item.cliente}</h3>

          <div className="flex flex-col gap-2 w-full">
            <div className="text-[#f4f6fc80] uppercase text-xs text-md flex flex-row gap-2 items-center justify-between">
              <span>Item</span>
              <span>qtde</span>
            </div>

            {item.items.map((produto) => (
              <div className="text-[#f4f6fc] text-md flex flex-row gap-2 items-center justify-between">
                <span>
                  {produtos.find((p) => p.id == produto.produtoId)?.nome}
                </span>
                <b>{produto.qtde}</b>
              </div>
            ))}
          </div>

          <Divider className="w-full" color="#eed0d5" />

          <div className="text-[#f4f6fc] uppercase flex flex-row justify-between">
            <b>Total</b>
            <b className="text-xl">
              {item.items.reduce(
                (acc, produto) =>
                  acc + (produto.qtde ? Number(produto.qtde) : 0),
                0
              )}{" "}
            </b>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
