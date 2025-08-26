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

// Allow both local + ECS load balancer
const allowedOrigins = [
  "http://localhost:3000",   // local client
  "http://localhost:5173",   // local Vite
  "https://your-client-url.com",  // replace with deployed client URL
  "https://your-admin-url.com",   // replace with deployed admin URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check for ECS
app.get("/", (req, res) => {
  res.json({ status: "✅ Backend is running!" });
});

// Serve uploaded images if needed
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// Routes
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("🔥 Global Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// IMPORTANT: ECS health check expects containerPort = 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Backend running on port ${PORT}`);
});
