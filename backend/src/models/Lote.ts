import { db } from "../firestore";

export interface ILote {
  titulo: string;
  data_inicio?: string;
  data_fim?: string;
  favorito: boolean;
}

const lotesRef = db.collection("lotes");

export { lotesRef };
