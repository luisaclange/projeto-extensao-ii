import { LotePage } from "~/pages/lote";
import type { Route } from "./+types/home";
import { verifyIfUserIsAuthenticated } from "~/middleware/verifyIfUserIsAuthenticated";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack - Lote" },
    { name: "description", content: "Lote - SweetTrack" },
  ];
}

export function clientLoader() {
  verifyIfUserIsAuthenticated();
}

export default function Lote() {
  return <LotePage />;
}
