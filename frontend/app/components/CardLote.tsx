import {
  CalendarMonth,
  Cookie,
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  Inventory,
  PeopleOutline,
} from "@mui/icons-material";
import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { IResLote } from "~/pages/home";
import api from "~/services/axios";
import type { ILote } from "~/types/lote.type";
import { parseDate } from "~/utils/parseDate";

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
      className="h-full min-h-48 w-full rounded-2xl"
      sx={{ borderRadius: "16px" }}
      elevation={0}
      onClick={() => {
        handleRedirectLote();
      }}
    >
      <CardContent className="p-4 flex flex-col gap-6">
        <div className="flex flex-row justify-between">
          <h3 className="text-[#f4f6fc]">{item.titulo}</h3>
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
        <div className="flex flex-col gap-4">
          {!!item.data_fim && !!item.data_inicio ? (
            <p className="text-pink-50 text-sm">
              <CalendarMonth className="mr-2" />
              <span>{`${parseDate(item.data_inicio)} à ${parseDate(item.data_fim)}`}</span>
            </p>
          ) : null}
          <p className="text-pink-50 text-sm">
            <PeopleOutline className="mr-2" />
            <span>
              {item.numeroPedidos || 0} pedido
              {item.numeroPedidos == 1 ? "" : "s"}
            </span>
          </p>
          <p className="text-pink-50 text-sm">
            <Cookie className="mr-2" />
            <span>
              {item.numeroItems || 0} item
              {item.numeroItems == 1 ? "" : "s"}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
