import { Router } from "express";
import { ValidateLoginUser, ValidateRegisterUser } from "../validator/auth.validator.js";
import { getCurrentUser, GoogleAuthCallback, LoginUser, registerUser } from "../controllers/auth.controller.js";
import passport from "passport";
import { authenticateUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", ValidateRegisterUser, registerUser);
authRouter.post("/login", ValidateLoginUser,LoginUser);

authRouter.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}))

authRouter.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_auth_failed`
}), GoogleAuthCallback);

authRouter.get("/me", authenticateUser, getCurrentUser);

export default authRouter;
