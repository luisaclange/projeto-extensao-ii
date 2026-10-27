export enum EStatusUsuario {
  "ativo",
  "pendente",
  "recusado",
}

export interface IUsuario {
  id: string;
  nome: string;
  cpf: string;
  status: EStatusUsuario;
}
