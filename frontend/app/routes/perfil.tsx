import type { Route } from "./+types/home";
import { verifyIfUserIsAuthenticated } from "~/middleware/verifyIfUserIsAuthenticated";
import { PerfilPage } from "~/pages/perfil";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack - Minha Conta" },
    { name: "description", content: "Minha Conta - SweetTrack" },
  ];
}

export function clientLoader() {
  verifyIfUserIsAuthenticated();
}

export default function Perfil() {
  return <PerfilPage />;
}
