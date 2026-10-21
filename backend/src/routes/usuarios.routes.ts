import { Router } from "express";
import usuariosController from "../controllers/usuarios.controller";

const router: Router = Router();

router.post("/", usuariosController.create);
router.get("/", usuariosController.getAll);
router.get("/:id", usuariosController.getOne);
router.put("/:id", usuariosController.update);
router.delete("/:id", usuariosController.delete);

export default router;
