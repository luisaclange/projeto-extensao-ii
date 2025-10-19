import { Request, Response } from "express";
import { produtosRef } from "../models/Produto";

const produtosController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const newProduto = await produtosRef.add({
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const produtoRef = produtosRef.doc(newProduto.id);
      const snapshot = await produtoRef.get();

      const produto = { id: snapshot.id, ...snapshot.data() };
      res.status(201).json(produto);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const produtoRef = produtosRef.doc(req.params.id);
      const snapshot = await produtoRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      await produtoRef.update({
        ...req.body,
        updatedAt: new Date().toISOString(),
      });
      const updated = await produtoRef.get();
      res.json({ id: updated.id, ...updated.data() });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const produtoRef = produtosRef.doc(req.params.id);
      const snapshot = await produtoRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      await produtoRef.delete();
      res.json({ message: "Produto deletado com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const snapshot = await produtosRef.get();
      const produtos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(produtos);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const produtoRef = produtosRef.doc(req.params.id);
      const snapshot = await produtoRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      const produto = {
        id: snapshot.id,
        ...snapshot.data(),
      };

      res.json(produto);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default produtosController;
