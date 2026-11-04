import productModel from "../models/product.model.js";

export const createProduct = async (req, res) => {
    const { title, description, price, images } = req.body;

    try {
        const product = await productModel.create({
            title,
            description,
            price,
            images,
            seller: req.user._id // Attach the seller's ID from the authenticated user
        })
        return res.status(201).json({ message: "Product created successfully", product });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}