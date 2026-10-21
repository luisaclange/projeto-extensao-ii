import { verifyIfUserIsAuthenticated } from "~/middleware/verifyIfUserIsAuthenticated";
import type { Route } from "./+types/home";
import { ProdutoPage } from "~/pages/produto";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack - Produto" },
    { name: "description", content: "Produto - SweetTrack" },
  ];
}

export function clientLoader() {
  verifyIfUserIsAuthenticated();
}

export default function Produto() {
  return <ProdutoPage />;
}
