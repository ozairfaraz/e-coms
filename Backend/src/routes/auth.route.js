import { Router } from "express";
import {
  loginController,
  registerController,
  verifyEmailController,
} from "../controller/auth/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.get("/verify-email", verifyEmailController);
authRouter.post("/login", loginController);

export default authRouter;
