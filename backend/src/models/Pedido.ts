import mongoose, { Schema, Document } from "mongoose";

export interface IPedido extends Document {
  loteId: string;
  cliente: string;
  items: {
    produtoId: string;
    qtde: number;
  }[];
}

const PedidoSchema: Schema = new Schema(
  {
    loteId: { type: Schema.Types.ObjectId, ref: "Lote", required: true },
    cliente: { type: String, required: true },
    items: [{
        produtoId: { type: Schema.Types.ObjectId, ref: "Produto", required: true },
        qtde: { type: Number, required: true },
    }]
  },
  { timestamps: true }
);

export default mongoose.model<IPedido>("Pedido", PedidoSchema);