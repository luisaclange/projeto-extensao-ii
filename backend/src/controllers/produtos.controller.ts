import { Router, Request, Response } from "express";
import Produto, { IProduto } from "../models/Produto";

const produtosController = {
    async create (req: Request, res: Response): Promise<void> {
        try {
            const produto: IProduto = new Produto(req.body);
            await produto.save();

            res.status(201).json(produto);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },


    async update (req: Request, res: Response): Promise<void> {
        try {
            const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });

            res.json(produto);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete (req: Request, res: Response): Promise<void> {
        try {
            await Produto.findByIdAndDelete(req.params.id);

            res.json({ message: "Produto deletado com sucesso" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async getAll (req: Request, res: Response): Promise<void> {
        try {
            const filters = req.query;
            const produtos: IProduto[] = await Produto.find(filters);

            res.json(produtos);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async getOne (req: Request, res: Response): Promise<void> {
        try {
            const produto = await Produto.findById(req.params.id);

            res.json(produto);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
}

export default produtosController;