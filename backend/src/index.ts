import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

// Connect to MongoDB
import connectDB from "./db";

// Import routes
import foodRoutes from "./routes/food.routes";
import orderRoutes from "./routes/order.routes";
import tableRoutes from "./routes/table.routes";
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

// Connect to MongoDB Atlas
connectDB(); // REQUIRED!

// --- ✅ CORS Setup ---
const allowedOrigins = [
  "https://restro-app-erlm.onrender.com",   // Admin frontend
  "https://restro-client.onrender.com",     // Client frontend
  "http://localhost:3000",                  // Local dev CRA
  "http://localhost:5173"                   // Local dev Vite
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    console.log("🌐 Incoming request origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS blocked:", origin);
      callback(new Error("CORS blocked for origin: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handle preflight OPTIONS requests
// --- ✅ End CORS Setup ---

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images statically
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// API Routes
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Optional: Global error handler
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("🔥 Global error handler:", JSON.stringify(err, null, 2));
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
);

// Start Server
const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
