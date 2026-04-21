import { Router } from "express";
import {
  forgotPasswordController,
  getMeController,
  googleAuthCallbackController,
  googleAuthStartController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerificationEmailController,
  resetPasswordController,
  verifyEmailController,
} from "../controller/auth/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.get("/verify-email", verifyEmailController);
authRouter.post("/resend-verification", resendVerificationEmailController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);
authRouter.get("/google", googleAuthStartController);
authRouter.get("/google/callback", googleAuthCallbackController);
authRouter.get("/get-me", authenticateUser, getMeController);

export default authRouter;
