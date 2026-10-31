import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { EStatusUsuario, IUsuario, usuariosRef } from "../models/Usuario";

async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token não informado.",
    });
  }

  const token = authHeader.split(" ")[1];

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    }) as JwtPayload;

    if (typeof decoded.sub !== "string") {
      return res.status(401).json({
        message: "Token inválido ou expirado.",
      });
    }

    const usuarioRef = usuariosRef.doc(decoded.sub);
    const snapshot = await usuarioRef.get();
    const usuario = snapshot.data() as IUsuario;

    if (usuario.status !== EStatusUsuario.ativo) {
      return res.status(401).json({
        message: "Token inválido ou expirado.",
      });
    }

    res.locals.userId = decoded.sub;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
}

export default authenticateToken;
