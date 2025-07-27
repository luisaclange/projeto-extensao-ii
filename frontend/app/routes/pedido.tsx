import type { Route } from "./+types/home";
import { PedidoPage } from "~/pages/pedido";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack - Pedido" },
    { name: "description", content: "Pedido - SweetTrack" },
  ];
}

export default function Pedido() {
  return <PedidoPage />;
}
