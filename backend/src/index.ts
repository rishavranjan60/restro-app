import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import connectDB from "./db";

// Routes
import foodRoutes from "./routes/food.routes";
import orderRoutes from "./routes/order.routes";
import tableRoutes from "./routes/table.routes";
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

// Connect to MongoDB Atlas
connectDB();

//  TEMP FIX: Allow all origins (for testing)
const allowedOrigins = [
  "https://your-admin-frontend.onrender.com",
  "https://your-client-frontend.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Health check endpoint for ALB
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root check
app.get("/", (req, res) => {
  res.json({ status: " Backend is running!" });
});

// Serve uploaded images
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// Routes
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(" Global Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// IMPORTANT: ECS health check expects containerPort = 5000
const PORT = parseInt(process.env.PORT || "5000", 10);

//  Must bind to 0.0.0.0 for ECS/ALB
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Backend running on port ${PORT}`);
});
