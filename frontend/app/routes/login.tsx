import type { Route } from "./+types/home";
import { LoginPage } from "app/pages/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SweetTrack - Login" },
    { name: "description", content: "Faça seu login" },
  ];
}

export default function Login() {
  return <LoginPage />;
}
