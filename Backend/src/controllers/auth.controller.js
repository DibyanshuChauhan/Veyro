import userModel from "../models/user.model.js"; 
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse (user, res, message) {
    const token = jwt.sign({ 
        id : user._id
    },config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    })

    res.status(200).json({ 
        token,
        message,
        success: true,
        user: {
            id: user_id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        } });
}

export const registerUser = async (req, res) => {
    const { email, contact, password, fullname, isSeller } = req.body;
    try {

        const existingUser = await userModel.findOne({
            $or: [{ email }, { contact }]
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: "User with this email or contact already exists "
});
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? "seller" : "buyer"
        });

        await sendTokenResponse(user, res, "User registered successfully");
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
