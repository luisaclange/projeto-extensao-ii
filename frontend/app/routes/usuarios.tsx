import { UsuariosPage } from "~/pages/usuarios";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack - Usuários" },
    { name: "description", content: "Usuários - SweetTrack" },
  ];
}

export default function Usuarios() {
  return <UsuariosPage />;
}
