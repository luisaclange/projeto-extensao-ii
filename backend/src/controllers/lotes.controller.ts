import { Request, Response } from "express";
import { lotesRef } from "../models/Lote";
import { IItem, IPedido, pedidosRef } from "../models/Pedido";

const lotesController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const newLote = await lotesRef.add({
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const loteRef = lotesRef.doc(newLote.id);
      const snapshot = await loteRef.get();

      const lote = { id: snapshot.id, ...snapshot.data() };
      res.status(201).json(lote);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const loteRef = lotesRef.doc(req.params.id);
      const snapshot = await loteRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Lote não encontrado" });
        return;
      }

      await loteRef.update({
        ...req.body,
        updatedAt: new Date().toISOString(),
      });
      const updated = await loteRef.get();
      res.json({ id: updated.id, ...updated.data() });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const loteRef = lotesRef.doc(req.params.id);
      const snapshot = await loteRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Lote não encontrado" });
        return;
      }

      await loteRef.delete();
      res.json({ message: "Lote deletado com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const snapshot = await lotesRef.get();
      const lotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        numeroPedidos: 0,
        numeroItems: 0,
      }));

      for (const lote of lotes) {
        const pedidosSnap = await pedidosRef
          .where("loteId", "==", lote.id)
          .get();

        const pedidos = pedidosSnap.docs.map((doc) => doc.data());

        // calcular resumo
        const numeroPedidos = pedidos.length;
        const numeroItems = pedidos.reduce((sum, pedido) => {
          const itemsQtde = (pedido.items || []).reduce(
            (s: number, item: IItem) => s + (item.qtde ? Number(item.qtde) : 0),
            0
          );
          return sum + itemsQtde;
        }, 0);

        lote.numeroPedidos = numeroPedidos;
        lote.numeroItems = numeroItems;
      }

      res.json(lotes);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const loteRef = lotesRef.doc(req.params.id);
      const snapshot = await loteRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Lote não encontrado" });
        return;
      }

      const pedidosSnap = await pedidosRef
        .where("loteId", "==", snapshot.id)
        .get();

      const pedidos = pedidosSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const lote = {
        id: snapshot.id,
        ...snapshot.data(),
        pedidos,
      };

      res.json(lote);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default lotesController;
