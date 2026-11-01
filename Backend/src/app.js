import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
    cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}),
);
app.use("/api/auth", authRouter);

// Health check route
app.get("/api/health", (_req, res) => {
    res.status(200).json({ message: "Veyro API is running" });
});

export default app;
