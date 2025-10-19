import { db } from "../firestore";

export interface IItem {
  produtoId: string;
  qtde: string;
}

export interface IPedido {
  loteId: string;
  cliente: string;
  items: IItem[];
}

const pedidosRef = db.collection("pedidos");

export { pedidosRef };
