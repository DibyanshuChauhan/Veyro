import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";

export const authenticateSeller = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        if (user.role !== "seller") {
            return res.status(403).json({ error: "Access denied. Only sellers are allowed." });
        }

        req.user = user; // Attach the user object to the request for further use
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        return res.status(401).json({ error: "Unauthorized access" });
    }
}