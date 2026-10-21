import { verifyIfUserIsAuthenticated } from "~/middleware/verifyIfUserIsAuthenticated";
import type { Route } from "./+types/home";
import { HomePage } from "app/pages/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack" },
    { name: "description", content: "Página inicial da SweetTrack" },
  ];
}

export function clientLoader() {
  verifyIfUserIsAuthenticated();
}

export default function Home() {
  return <HomePage />;
}
