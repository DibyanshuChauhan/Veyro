import { Router } from "express";
import { ValidateRegisterUser } from "../validator/auth.validator.js";
import { registerUser } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", ValidateRegisterUser, registerUser);

export default authRouter;