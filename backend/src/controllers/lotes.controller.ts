import { Request, Response } from "express";
import Lote, { ILote } from "../models/Lote";
import Pedido from "../models/Pedido";

const lotesController = {
    async create (req: Request, res: Response): Promise<void> {
        try {
            const lote: ILote = new Lote(req.body);
            await lote.save();

            res.status(201).json(lote);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },


    async update (req: Request, res: Response): Promise<void> {
        try {
            const lote = await Lote.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });

            if (lote)
                res.json(lote);
            else res.status(404).json({ error: "Lote não encontrado" })        
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete (req: Request, res: Response): Promise<void> {
        try {
            const lote = await Lote.findByIdAndDelete(req.params.id);

            if (lote) { 
                await Pedido.deleteMany({ loteId: req.params.id });
                res.json({ message: "Lote deletado com sucesso" });
            }
            else res.status(404).json({ error: "Lote não encontrado" })
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async getAll (req: Request, res: Response): Promise<void> {
        try {
            const filters = req.query;
            const lotes: ILote[] = await Lote.find(filters);

            res.json(lotes);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async getOne (req: Request, res: Response): Promise<void> {
        try {
            const lote = await Lote.findById(req.params.id);
            
            if (lote) {
                const pedidos = await Pedido.find({
                    loteId: req.params.id
                });

                res.json({
                    ...lote?.toJSON(),
                    pedidos
                });
            }

            else res.status(404).json({ error: "Lote não encontrado" })
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
}

export default lotesController;