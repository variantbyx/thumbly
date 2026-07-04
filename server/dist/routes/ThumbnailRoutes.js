import { Router } from "express";
import { deleteThumbnail, generateThumbnail, } from "../controllers/ThumbnailController.js";
const router = Router();
router.post("/generate", generateThumbnail);
router.delete("/:id", deleteThumbnail);
export default router;
