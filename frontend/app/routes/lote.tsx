import { LotePage } from "~/pages/lote";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack - Lote" },
    { name: "description", content: "Lote - SweetTrack" },
  ];
}

export default function Lote() {
  return <LotePage />;
}
