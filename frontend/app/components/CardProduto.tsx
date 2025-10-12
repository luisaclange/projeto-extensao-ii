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
      className="h-full"
      sx={{ borderRadius: "16px" }}
      onClick={() => handleRedirectProduto(item._id)}
    >
      <CardContent className="p-4 flex justify-between">
        <div className="flex flex-col">
          <h3 className="text-[#f4f6fc]">{item.nome}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
