import bcrypt from "bcrypt";
import "dotenv/config";
import { EStatusUsuario, usuariosRef } from "../models/Usuario";

export async function seedAdmin(): Promise<void> {
  const snapshot = await usuariosRef.limit(1).get();

  if (!snapshot.empty) {
    console.log("Já existem usuários cadastrados. Nenhum usuário criado.");
    return;
  }

  const cpf = "00000000000";
  const senha = "123admin";

  const senhaHash = await bcrypt.hash(senha, 12);

  await usuariosRef.add({
    cpf,
    senha: senhaHash,
    nome: "admin",
    status: EStatusUsuario.ativo,
  });

  console.log("Administrador padrão criado com sucesso.");
}
