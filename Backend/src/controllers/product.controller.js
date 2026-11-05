import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    try {
        const images = await Promise.all((req.files ?? []).map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname,
                folder: "veyro"
            })
        }))

        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            images,
            seller: seller._id
        })

        res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating product",
            success: false,
            error: error.message
        })
    }
}
