import { Router } from "express";
import produtosController from "../controllers/produtos.controller";

const router: Router = Router();

router.post("/", produtosController.create);
router.get("/", produtosController.getAll);
router.get("/:id", produtosController.getOne);
router.put("/:id", produtosController.update);
router.delete("/:id", produtosController.delete);

export default router;
