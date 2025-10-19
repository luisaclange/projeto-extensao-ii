import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

import lotesRoutes from "./routes/lotes.routes";
import produtosRoutes from "./routes/produtos.routes";
import pedidosRoutes from "./routes/pedidos.routes";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:5173" // libera só o frontend local
    origin: "*", // (cuidado) libera para qualquer origem
  })
);

// Rotas
app.use("/api/lotes", lotesRoutes);
app.use("/api/produtos", produtosRoutes);
app.use("/api/pedidos", pedidosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
