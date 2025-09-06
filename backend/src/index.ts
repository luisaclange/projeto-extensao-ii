import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import lotesRoutes from "./routes/lotes.routes";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Conexão MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Rotas
app.use("/api/lotes", lotesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
