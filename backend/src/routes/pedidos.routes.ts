import { Router } from "express";
import pedidosController from "../controllers/pedidos.controller";

const router: Router = Router();

router.post("/", pedidosController.create);
router.get("/", pedidosController.getAll);
router.get("/:id", pedidosController.getOne);
router.put("/:id", pedidosController.update);
router.delete("/:id", pedidosController.delete);

export default router;
