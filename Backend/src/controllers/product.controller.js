import mongoose from "mongoose";
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

export const getProductsBySeller = async (req, res) => {
const seller = req.user;

    try {
        const products = await productModel.find({ seller: seller._id });
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching products",
            success: false,
            error: error.message
        }) 
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("seller", "fullname email contact").sort({ createdAt: -1 });
        res.status(200).json({
            message: "All archival products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching catalog products",
            success: false,
            error: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Archival product not found",
            success: false
        });
    }

    try {
        const product = await productModel.findById(id).populate("seller", "fullname email contact");
        if (!product) {
            return res.status(404).json({
                message: "Archival product not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching product details",
            success: false,
            error: error.message
        });
    }
};