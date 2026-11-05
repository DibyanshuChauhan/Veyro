import "dotenv/config";

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment");
}

if( !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment");
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined in the environment");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in the environment");
}

if (!process.env.GOOGLE_CALLBACK_URL) {
    throw new Error("GOOGLE_CALLBACK_URL is not defined in the environment");
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined in the environment");
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY
};
