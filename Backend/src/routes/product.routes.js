import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/", authenticateSeller, createProduct);

export default productRouter;