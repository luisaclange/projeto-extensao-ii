import { Router } from "express";
import usuariosController from "../controllers/usuarios.controller";
import authenticateToken from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/", usuariosController.create);
router.get("/", authenticateToken, usuariosController.getAll);
router.get("/:id", authenticateToken, usuariosController.getOne);
router.put("/:id", authenticateToken, usuariosController.update);
router.delete("/:id", authenticateToken, usuariosController.delete);

export default router;
