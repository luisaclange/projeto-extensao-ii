import { Request, Response } from "express";
import Pedido, { IPedido } from "../models/Pedido";

const pedidosController = {
    async create (req: Request, res: Response): Promise<void> {
        try {
            const pedido: IPedido = new Pedido(req.body);
            await pedido.save();

            res.status(201).json(pedido);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },


    async update (req: Request, res: Response): Promise<void> {
        try {
            const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });

            res.json(pedido);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete (req: Request, res: Response): Promise<void> {
        try {
            await Pedido.findByIdAndDelete(req.params.id);

            res.json({ message: "Pedido deletado com sucesso" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async getAll (req: Request, res: Response): Promise<void> {
        try {
            const filters = req.query;
            const pedidos: IPedido[] = await Pedido.find(filters);

            res.json(pedidos);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async getOne (req: Request, res: Response): Promise<void> {
        try {
            const pedido = await Pedido.findById(req.params.id);

            res.json(pedido);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
}

export default pedidosController;