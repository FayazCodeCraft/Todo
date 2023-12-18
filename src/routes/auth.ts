import express from "express";
import { login, logout, refreshTokens, register } from "../controllers/auth.js";
import authenticateUser from "../middlewares/authentication.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authenticateUser, logout);
router.route("/refresh-tokens").post(refreshTokens);

export default router;
