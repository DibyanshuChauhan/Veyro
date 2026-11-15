import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct, getProductsBySeller, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    }
});

const productRouter = Router();

// Multer must parse multipart/form-data before express-validator reads req.body.
productRouter.post("/", authenticateSeller, upload.any(), createProductValidator, createProduct);
productRouter.get("/seller", authenticateSeller, getProductsBySeller);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", authenticateSeller, upload.any(), updateProduct);

export default productRouter;
