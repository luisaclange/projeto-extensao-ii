import { CadastroPage } from "~/pages/cadastro";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack - Cadastro" },
    { name: "description", content: "Faça seu cadastro" },
  ];
}

export default function Cadastro() {
  return <CadastroPage />;
}
