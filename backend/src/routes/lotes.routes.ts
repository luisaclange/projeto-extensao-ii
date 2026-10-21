import { Router } from "express";
import lotesController from "../controllers/lotes.controller";
import authenticateToken from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/", authenticateToken, lotesController.create);
router.get("/", authenticateToken, lotesController.getAll);
router.get("/:id", authenticateToken, lotesController.getOne);
router.put("/:id", authenticateToken, lotesController.update);
router.delete("/:id", authenticateToken, lotesController.delete);

export default router;
