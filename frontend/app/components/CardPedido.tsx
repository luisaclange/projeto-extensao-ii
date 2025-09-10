import { Cookie, Person, Person2Outlined } from "@mui/icons-material";
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
      className="border-2 border-[#eed0d5] h-full min-h-48"
      onClick={() => handleRedirectPedido(item._id)}
    >
      <CardContent className="p-4 flex flex-row justify-between gap-4">
        <div className="flex flex-col gap-4 w-full">
          <h3>{item.cliente}</h3>

          {item.items.map((produto) => (
            <div className="text-pink-50 text-md flex flex-row gap-2 items-center">
              <b>{produto.qtde}</b>
              <b>-</b>
              <b>{produtos.find((p) => p._id == produto.produtoId)?.nome}</b>
            </div>
          ))}

          <Divider className="w-full" color="#eed0d5" />

          <b className="flex flex-row justify-end">
            Total: {item.items.reduce((acc, produto) => acc + produto.qtde, 0)}{" "}
            items
          </b>
        </div>
      </CardContent>
    </Card>
  );
}
