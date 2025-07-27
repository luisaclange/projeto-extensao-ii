import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), 
    route("lote", "routes/lote.tsx"), 
    route("pedido", "routes/pedido.tsx"),
    route("produto", "routes/produto.tsx")
] satisfies RouteConfig;
