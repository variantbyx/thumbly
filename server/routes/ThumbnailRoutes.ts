import { Router } from "express";
import {
  deleteThumbnail,
  generateThumbnail,
} from "../controllers/ThumbnailController.js";
import protect from "../middlewares/auth.js";

const router = Router();

router.post("/generate", protect, generateThumbnail);
router.delete("/:id", protect, deleteThumbnail);

export default router;
