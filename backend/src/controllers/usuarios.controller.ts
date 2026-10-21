import { Request, Response } from "express";
import { IItem, IPedido, pedidosRef } from "../models/Pedido";
import { EStatusUsuario, usuariosRef } from "../models/Usuario";
import bcrypt from "bcrypt";

const usuariosController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const snapshotUsers = await usuariosRef
        .where("cpf", "==", req.body.cpf)
        .limit(1)
        .get();

      if (!snapshotUsers.empty) {
        res.status(401).json({ error: "Este CPF já está cadastrado." });
        return;
      }

      const senhaHashed = bcrypt.hash(req.body.senha, 10);

      const newUsuario = await usuariosRef.add({
        ...req.body,
        senha: senhaHashed,
        status: EStatusUsuario.pendente,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const usuarioRef = usuariosRef.doc(newUsuario.id);
      const snapshot = await usuarioRef.get();

      const lote = { id: snapshot.id, ...snapshot.data() };
      res.status(201).json(lote);
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

      const dataUsuario = { ...req.body, updatedAt: new Date().toISOString() };

      if (dataUsuario.senha) {
        const senhaHashed = bcrypt.hash(req.body.senha, 10);
        dataUsuario.senha = senhaHashed;
      }

      await usuarioRef.update(dataUsuario);
      const updated = await usuarioRef.get();
      res.json({ id: updated.id, ...updated.data() });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const usuarioRef = usuariosRef.doc(req.params.id);
      const snapshot = await usuarioRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
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
      const usuarios = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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
      const usuario = {
        id: snapshot.id,
        ...snapshot.data(),
      };

      res.json(usuario);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default usuariosController;
