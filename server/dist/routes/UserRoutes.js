import { Router } from "express";
import UserController from "../controllers/UserController.js";
import protect from "../middlewares/auth.js";
const router = Router();
router.get("/thumbnails", protect, UserController.getUsersThumbnails);
router.get("/thumbnail/:id", protect, UserController.getThumbnailbyId);
export default router;
