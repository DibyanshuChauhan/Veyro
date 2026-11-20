import userModel from "../models/user.model.js";

/**
 * User Data Access Object (DAO)
 * Centralizes all MongoDB database interactions for the User model.
 */

// Find a user document by their unique MongoDB ObjectId
export const findUserById = async (userId) => {
    return await userModel.findById(userId);
};

// Find a single user by their email address
export const findUserByEmail = async (email) => {
    return await userModel.findOne({ email });
};

// Find a user by either email or contact number (useful during registration check)
export const findUserByEmailOrContact = async (email, contact) => {
    const conditions = [];
    if (email) conditions.push({ email });
    if (contact) conditions.push({ contact });
    if (conditions.length === 0) return null;

    return await userModel.findOne({ $or: conditions });
};

// Create and persist a new user in the database
export const createUser = async (userData) => {
    return await userModel.create(userData);
};

// Update an existing user by their ID
export const updateUserById = async (userId, updateData) => {
    return await userModel.findByIdAndUpdate(userId, updateData, { new: true });
};
