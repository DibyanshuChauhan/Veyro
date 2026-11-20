import { param, body, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array()
        });
    }
    next();
};

export const validateAddToCart = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product ID"),
    param("variantId")
        .optional()
        .custom((val) => {
            if (val === undefined || val === null || val === "undefined" || val === "null") {
                return true;
            }
            return /^[0-9a-fA-F]{24}$/.test(val);
        })
        .withMessage("Invalid variant ID"),
    body("quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Quantity must be an integer of at least 1"),
    validateRequest
];

export const validateUpdateCartItem = [
    param("itemId")
        .isMongoId()
        .withMessage("Invalid cart item ID"),
    body("quantity")
        .isInt({ min: 0 })
        .withMessage("Quantity must be a non-negative integer"),
    validateRequest
];

export const validateRemoveCartItem = [
    param("itemId")
        .isMongoId()
        .withMessage("Invalid cart item ID"),
    validateRequest
];
