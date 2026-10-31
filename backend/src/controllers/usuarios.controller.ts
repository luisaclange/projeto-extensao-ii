import { Request, Response } from "express";
import { EStatusUsuario, IUsuario, usuariosRef } from "../models/Usuario";
import bcrypt from "bcrypt";

async function existeOutroUsuarioAtivo(userId: string): Promise<boolean> {
  const snapshot = await usuariosRef
    .where("status", "==", EStatusUsuario.ativo)
    .get();

  return snapshot.docs.some((doc) => doc.id !== userId);
}

const usuariosController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const snapshotUsers = await usuariosRef
        .where("cpf", "==", req.body.cpf)
        .limit(1)
        .get();

      if (!snapshotUsers.empty) {
        res.status(401).json({ message: "Este CPF já está cadastrado." });
        return;
      }

      const senhaHashed = await bcrypt.hash(req.body.senha, 10);

      await usuariosRef.add({
        ...req.body,
        senha: senhaHashed,
        status: EStatusUsuario.pendente,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      res.status(201).json({
        message: "Usuário criado",
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const usuarioRef = usuariosRef.doc(req.params.id);
      const snapshot = await usuarioRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      const usuarioAtual = snapshot.data() as IUsuario;

      if (
        usuarioAtual.status === EStatusUsuario.ativo &&
        req.body.status !== undefined &&
        req.body.status !== EStatusUsuario.ativo
      ) {
        const existeOutroAtivo = await existeOutroUsuarioAtivo(req.params.id);

        if (!existeOutroAtivo) {
          res.status(401).json({
            message:
              "Não é possível desativar o único usuário ativo do sistema.",
          });
          return;
        }
      }

      const dataUsuario = { ...req.body, updatedAt: new Date().toISOString() };

      if (dataUsuario.senha) {
        const senhaHashed = await bcrypt.hash(req.body.senha, 10);
        dataUsuario.senha = senhaHashed;
      }

      await usuarioRef.update(dataUsuario);
      const updated = await usuarioRef.get();
      const usuario = updated.data() as IUsuario;
      const { senha, ...usuarioSemSenha } = usuario;
      res.json({ id: updated.id, ...usuarioSemSenha });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = res.locals.userId;
      if (userId == req.params.id) {
        res.status(401).json({
          error:
            "Você não pode excluir seu usuário. Acesse seu perfil para fazer isso.",
        });
        return;
      }

      const usuarioRef = usuariosRef.doc(req.params.id);
      const snapshot = await usuarioRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      const usuario = snapshot.data() as IUsuario;

      if (usuario.status === EStatusUsuario.ativo) {
        const existeOutroAtivo = await existeOutroUsuarioAtivo(req.params.id);

        if (!existeOutroAtivo) {
          res.status(400).json({
            error: "Não é possível excluir o único usuário ativo do sistema.",
          });
          return;
        }
      }

      await usuarioRef.delete();
      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const snapshot = await usuariosRef.get();
      const usuarios = snapshot.docs.map((doc) => {
        const usuario = doc.data() as IUsuario;
        const { senha, ...usuarioSemSenha } = usuario;
        return { id: doc.id, ...usuarioSemSenha };
      });

      res.json(usuarios);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const usuarioRef = usuariosRef.doc(req.params.id);
      const snapshot = await usuarioRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }
      const usuario = snapshot.data() as IUsuario;
      const { senha, ...usuarioSemSenha } = usuario;

      res.json({ id: snapshot.id, ...usuarioSemSenha });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default usuariosController;
