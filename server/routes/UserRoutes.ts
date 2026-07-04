import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = Router();

router.get("/thumbnails", UserController.getUsersThumbnails);
router.get("/thumbnail/:id", UserController.getThumbnailbyId);

export default router;
