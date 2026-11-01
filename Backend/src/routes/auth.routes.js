import { Router } from "express";
import { ValidateLoginUser, ValidateRegisterUser } from "../validator/auth.validator.js";
import { LoginUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", ValidateRegisterUser, registerUser);
authRouter.post("/login", ValidateLoginUser,LoginUser);

export default authRouter;