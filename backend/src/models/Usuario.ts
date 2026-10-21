import { db } from "../firestore";

export enum EStatusUsuario {
  "ativo",
  "inativo",
  "pendente",
  "recusado",
}

export interface IUsuario {
  nome: string;
  cpf: string;
  senha: string;
  status: EStatusUsuario;
}

const usuariosRef = db.collection("usuarios");

export { usuariosRef };
