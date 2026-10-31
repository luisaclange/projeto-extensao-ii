import { Router } from "express";
import authController from "../controllers/auth.controller";
import authenticateToken from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/login", authController.login);
router.get("/account", authenticateToken, authController.profile);
router.delete("/account", authenticateToken, authController.deleteAccount);

export default router;
