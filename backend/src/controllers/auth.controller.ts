import { Request, Response } from "express";
import { EStatusUsuario, IUsuario, usuariosRef } from "../models/Usuario";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

const authController = {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { cpf, senha } = req.body;

      if (!cpf || !senha) {
        res.status(400).json({
          message: "CPF e senha são obrigatórios.",
        });
        return;
      }

      const snapshot = await usuariosRef.where("cpf", "==", cpf).limit(1).get();

      if (snapshot.empty) {
        res.status(401).json({
          message: "Credenciais inválidas.",
        });
        return;
      }

      const doc = snapshot.docs[0];
      const usuario = doc.data();

      const passwordIsValid = await bcrypt.compare(senha, usuario.senha);

      if (!passwordIsValid) {
        res.status(401).json({
          message: "Credenciais inválidas.",
        });
        return;
      }

      switch (usuario.status) {
        case EStatusUsuario.pendente: {
          res.status(403).json({
            message: "Avaliação pendente",
          });
          return;
        }
        case EStatusUsuario.recusado: {
          res.status(403).json({
            message: "Usuário recusado",
          });
          return;
        }
        default: {
        }
      }

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new Error("JWT_SECRET não configurado.");
      }

      const token = jwt.sign({ sub: doc.id }, secret, {
        algorithm: "HS256",
        expiresIn: "60m",
      });

      res.status(200).json({
        token,
        tokenType: "Bearer",
        expiresIn: 3600000,
      });
    } catch (error: unknown) {
      console.error(error);

      res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  },

  async profile(req: Request, res: Response): Promise<void> {
    try {
      const userId = res.locals.userId;
      if (!userId) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      const usuarioRef = usuariosRef.doc(userId);
      const snapshot = await usuarioRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }
      const usuario = snapshot.data() as IUsuario;
      const { senha, ...usuarioSemSenha } = usuario;

      res.json({ id: snapshot.id, ...usuarioSemSenha });
    } catch (error: unknown) {
      console.error(error);

      res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  },

  async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = res.locals.userId;
      if (!userId) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      const usuarioRef = usuariosRef.doc(userId);
      const snapshot = await usuarioRef.get();

      if (!snapshot.exists) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      await usuarioRef.delete();
      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error: unknown) {
      console.error(error);

      res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  },
};

export default authController;
