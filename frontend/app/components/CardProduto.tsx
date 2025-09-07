import { useNavigate } from "react-router";
import type { IProduto } from "~/types/produto.type";
import { Button, Card, CardContent } from "@mui/material";

export function CardProduto({ item }: { item: IProduto }) {
  const navigate = useNavigate();

  const handleRedirectProduto = (id?: string) => {
    navigate(`/produto${id ? `?id=${id}` : ""}`);
  };

  return (
    <Card
      className="border-2 border-[#eed0d5] h-full min-h-16"
      onClick={() => handleRedirectProduto(item._id)}
    >
      <CardContent className="p-4 flex justify-between">
        <div className="flex flex-col">
          <h3>{item.nome}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
