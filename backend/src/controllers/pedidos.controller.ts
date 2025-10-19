import { Request, Response } from "express";
import { pedidosRef } from "../models/Pedido";

const pedidosController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const newPedido = await pedidosRef.add({
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const pedidoRef = pedidosRef.doc(newPedido.id);
      const snapshot = await pedidoRef.get();

      const pedido = { id: snapshot.id, ...snapshot.data() };
      res.status(201).json(pedido);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const pedidoRef = pedidosRef.doc(req.params.id);
      const snapshot = await pedidoRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Pedido não encontrado" });
        return;
      }

      await pedidoRef.update({
        ...req.body,
        updatedAt: new Date().toISOString(),
      });
      const updated = await pedidoRef.get();
      res.json({ id: updated.id, ...updated.data() });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const pedidoRef = pedidosRef.doc(req.params.id);
      const snapshot = await pedidoRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Pedido não encontrado" });
        return;
      }

      await pedidoRef.delete();
      res.json({ message: "Pedido deletado com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const snapshot = await pedidosRef.get();
      const pedidos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.json(pedidos);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const pedidoRef = pedidosRef.doc(req.params.id);
      const snapshot = await pedidoRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Pedido não encontrado" });
        return;
      }

      const pedido = {
        id: snapshot.id,
        ...snapshot.data(),
      };

      res.json(pedido);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default pedidosController;
