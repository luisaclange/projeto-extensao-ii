import mongoose, { Schema, Document } from "mongoose";

export interface IProduto extends Document {
  nome: string;
}

const ProdutoSchema: Schema = new Schema(
  {
    nome: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduto>("Produto", ProdutoSchema);