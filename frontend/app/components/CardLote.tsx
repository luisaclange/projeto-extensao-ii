import {
  CalendarMonth,
  Cookie,
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  PeopleOutline,
} from "@mui/icons-material";
import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { IResLote } from "~/pages/home";
import api from "~/services/axios";
import type { ILote } from "~/types/lote.type";

export function CardLote({
  item,
  setItem,
}: {
  item: IResLote;
  setItem: (value: Partial<ILote>) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRedirectLote = () => {
    navigate(`/lote?id=${item._id}`);
  };

  const handleFavorite = async () => {
    try {
      setIsLoading(true);
      await api.put(`/lotes/${item._id}`, {
        favorito: !item.favorito,
      });
      setItem({
        favorito: !item.favorito,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className="border-2 border-[#eed0d5] h-full min-h-48 w-full"
      onClick={() => {
        handleRedirectLote();
      }}
    >
      <CardContent className="p-4 flex flex-row justify-between gap-4">
        <div className="flex flex-col gap-4">
          <h3>{item.titulo}</h3>
          <p className="text-pink-50 text-sm">
            <CalendarMonth className="mr-2" />
            <b>
              {!!item.data_fim && !!item.data_inicio
                ? `${item.data_inicio} à ${item.data_fim}`
                : "----"}
            </b>
          </p>
          <p className="text-pink-50 text-sm">
            <PeopleOutline className="mr-2" />
            <b>
              {item.numeroPedidos || 0} pedido
              {item.numeroPedidos == 1 ? "" : "s"}
            </b>
          </p>
          <p className="text-pink-50 text-sm">
            <Cookie className="mr-2" />
            <b>
              {item.numeroItems || 0} item
              {item.numeroItems == 1 ? "" : "s"}
            </b>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
          >
            {isLoading ? (
              <CircularProgress size="1rem" />
            ) : item.favorito ? (
              <Favorite />
            ) : (
              <FavoriteBorder />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
