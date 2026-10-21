import { Router } from "express";
import pedidosController from "../controllers/pedidos.controller";
import authenticateToken from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/", authenticateToken, pedidosController.create);
router.get("/", authenticateToken, pedidosController.getAll);
router.get("/:id", authenticateToken, pedidosController.getOne);
router.put("/:id", authenticateToken, pedidosController.update);
router.delete("/:id", authenticateToken, pedidosController.delete);

export default router;
