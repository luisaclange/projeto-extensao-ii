import { verifyIfUserIsAuthenticated } from "~/middleware/verifyIfUserIsAuthenticated";
import type { Route } from "./+types/home";
import { PedidoPage } from "~/pages/pedido";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack - Pedido" },
    { name: "description", content: "Pedido - SweetTrack" },
  ];
}

export function clientLoader() {
  verifyIfUserIsAuthenticated();
}

export default function Pedido() {
  return <PedidoPage />;
}
