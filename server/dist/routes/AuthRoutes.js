import { Router } from "express";
import { loginUser, logoutUser, registerUser, verifyUser, } from "../controllers/AuthControllers.js";
const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify", verifyUser);
export default router;
