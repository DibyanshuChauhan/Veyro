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

/**
 * Create and publish a new archival creation with optional variants and photographic frames.
 *
 * @param {string} title Title of the creation
 * @param {string} description Archival craftsmanship narrative
 * @param {number} priceAmount Acquisition valuation amount
 * @param {string} priceCurrency Valuation currency standard (default: INR)
 * @param {File[]} images Primary photographic frames
 * @param {string} [variants] JSON string array of variant editions with attributes, stock, price, and images
 */
productRouter.post("/", authenticateSeller, upload.any(), createProductValidator, createProduct);

/**
 * Fetch all creations cataloged by the authenticated seller atelier.
 *
 * @param {string} seller Authenticated seller credentials from session token
 */
productRouter.get("/seller", authenticateSeller, getProductsBySeller);

/**
 * Retrieve the full public catalog of archival creations.
 */
productRouter.get("/", getAllProducts);

/**
 * Retrieve detailed archival specifications for a single creation by ID.
 *
 * @param {string} id Unique MongoDB ObjectId of the archival piece
 */
productRouter.get("/:id", getProductById);

/**
 * Update an existing creation, imagery, or variant editions.
 *
 * @param {string} id Unique MongoDB ObjectId of the archival product
 * @param {string} [title] Updated title
 * @param {string} [description] Updated description narrative
 * @param {number} [priceAmount] Updated acquisition valuation
 * @param {string} [priceCurrency] Updated valuation currency standard
 * @param {File[]} [images] New replacement photographic frames
 * @param {string} [variants] Updated JSON string array of variant editions
 */
productRouter.put("/:id", authenticateSeller, upload.any(), updateProduct);

export default productRouter;
