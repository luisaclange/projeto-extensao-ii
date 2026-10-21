import { Router } from "express";
import produtosController from "../controllers/produtos.controller";
import authenticateToken from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/", authenticateToken, produtosController.create);
router.get("/", authenticateToken, produtosController.getAll);
router.get("/:id", authenticateToken, produtosController.getOne);
router.put("/:id", authenticateToken, produtosController.update);
router.delete("/:id", authenticateToken, produtosController.delete);

export default router;
