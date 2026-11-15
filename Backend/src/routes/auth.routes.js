import { Router } from "express";
import { ValidateLoginUser, ValidateRegisterUser } from "../validator/auth.validator.js";
import { getCurrentUser, GoogleAuthCallback, LoginUser, registerUser } from "../controllers/auth.controller.js";
import passport from "passport";
import { authenticateUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * Register a new user account (buyer or seller).
 *
 * @param {string} fullname Full name of the user
 * @param {string} email Valid email address of the user
 * @param {string} password Secret account password
 * @param {string} role User role ('buyer' or 'seller')
 */
authRouter.post("/register", ValidateRegisterUser, registerUser);

/**
 * Authenticate existing user with email and password.
 *
 * @param {string} email Registered user email address
 * @param {string} password Secret account password
 */
authRouter.post("/login", ValidateLoginUser, LoginUser);

/**
 * Initiate Google OAuth authentication flow.
 */
authRouter.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

/**
 * Handle Google OAuth callback and session redirection.
 *
 * @param {string} code Google OAuth authorization code
 */
authRouter.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_auth_failed`
}), GoogleAuthCallback);

/**
 * Retrieve authenticated profile information of current session user.
 *
 * @param {string} token Authorization bearer token or session cookie
 */
authRouter.get("/me", authenticateUser, getCurrentUser);

export default authRouter;
