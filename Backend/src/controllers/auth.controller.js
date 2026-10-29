import userModel from "../models/user.model.js"; 
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse (user, res) {
    const token = jwt.sign({ id : user._id}, config.JWT_SECRET, {
        expiresIn: "1d"
    })
    res.status(200).json({ token, user });
}

export const registerUser = async (req, res) => {
    const { email, contact, password, fullname } = req.body;
    try {

        const existingUser = await userModel.findOne({
            $or: [{ email }, { contact }]
        });

        if (existingUser) {
            return res.status(400).json({ error: "User with this email or contact already exists "});
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname
        });
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
