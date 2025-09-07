import mongoose, { Schema, Document } from "mongoose";

export interface ILote extends Document {
  titulo: string;
  data_inicio?: string;
  data_fim?: string;
  favorito: boolean;
}

const LoteSchema: Schema = new Schema(
  {
    titulo: { type: String, required: true },
    data_inicio: { type: String, required: false },
    data_fim: { type: String, required: false },
    favorito: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ILote>("Lote", LoteSchema);
