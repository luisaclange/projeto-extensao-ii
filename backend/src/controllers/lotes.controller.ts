import { Request, Response } from "express";
import Lote, { ILote } from "../models/Lote";
import Pedido from "../models/Pedido";

const lotesController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const lote: ILote = new Lote(req.body);
      await lote.save();

      res.status(201).json(lote);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const lote = await Lote.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (lote) res.json(lote);
      else res.status(404).json({ error: "Lote não encontrado" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const lote = await Lote.findByIdAndDelete(req.params.id);

      if (lote) {
        await Pedido.deleteMany({ loteId: req.params.id });
        res.json({ message: "Lote deletado com sucesso" });
      } else res.status(404).json({ error: "Lote não encontrado" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const lotes = await Lote.aggregate([
        { $match: filters },
        {
          $lookup: {
            from: "pedidos", // cuidado: no Mongo o nome é geralmente no plural e em minúsculo
            let: { loteId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$loteId", "$$loteId"] } } },
              {
                $group: {
                  _id: null,
                  numeroPedidos: { $sum: 1 },
                  numeroItems: { $sum: { $sum: "$items.qtde" } },
                },
              },
            ],
            as: "resumoPedidos",
          },
        },
        {
          $addFields: {
            numeroPedidos: {
              $ifNull: [
                { $arrayElemAt: ["$resumoPedidos.numeroPedidos", 0] },
                0,
              ],
            },
            numeroItems: {
              $ifNull: [{ $arrayElemAt: ["$resumoPedidos.numeroItems", 0] }, 0],
            },
          },
        },
        { $project: { resumoPedidos: 0 } },
      ]);

      res.json(lotes);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const lote = await Lote.findById(req.params.id);

      if (lote) {
        const pedidos = await Pedido.find({
          loteId: req.params.id,
        });

        res.json({
          ...lote?.toJSON(),
          pedidos,
        });
      } else res.status(404).json({ error: "Lote não encontrado" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default lotesController;
