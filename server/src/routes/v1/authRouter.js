import express from 'express';
import {forgotPassword, getUser, login, logout, Register, resetPassword, updatePassword, verifyOTP} from "../../controllers/authController.js";
import { isAuthenticated } from '../../Middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register", Register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update",isAuthenticated, updatePassword);

export default router;