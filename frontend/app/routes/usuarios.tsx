import { UsuariosPage } from "~/pages/usuarios";
import type { Route } from "./+types/home";
import { verifyIfUserIsAuthenticated } from "~/middleware/verifyIfUserIsAuthenticated";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack - Usuários" },
    { name: "description", content: "Usuários - SweetTrack" },
  ];
}

export function clientLoader() {
  verifyIfUserIsAuthenticated();
}

export default function Usuarios() {
  return <UsuariosPage />;
}
