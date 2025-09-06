import mongoose, { Schema, Document } from "mongoose";

export interface IPedido extends Document {
  loteId: string;
  cliente: string;
}

const PedidoSchema: Schema = new Schema(
  {
    loteId: { type: Schema.Types.ObjectId, ref: "Lote" },
    cliente: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IPedido>("Pedido", PedidoSchema);