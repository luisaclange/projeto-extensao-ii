import { db } from "../firestore";

export interface IProduto {
  nome: string;
}

const produtosRef = db.collection("produtos");

export { produtosRef };
