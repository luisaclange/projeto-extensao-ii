import { Router } from "express";
import lotesController from "../controllers/lotes.controller";

const router: Router = Router();

router.post("/", lotesController.create);
router.get("/", lotesController.getAll);
router.get("/:id", lotesController.getOne);
router.put("/:id", lotesController.update);
router.delete("/:id", lotesController.delete);

export default router;
