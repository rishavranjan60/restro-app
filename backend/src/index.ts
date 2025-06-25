import dotenv from 'dotenv';
dotenv.config();


import express from "express";
import cors from "cors";
import path from "path";

// Add this line to connect to MongoDB
import connectDB from './db';


// Import routes
import foodRoutes from "./routes/food.routes";
import orderRoutes from "./routes/order.routes";
import tableRoutes from "./routes/table.routes";
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

// Connect to MongoDB Atlas
connectDB(); // REQUIRED!

// Middlewares
app.use(cors({
  origin: [
    "https://restro-client.onrender.com/",
    "https://restro-app-erlm.onrender.com/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images from /uploads statically
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// API Routes
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
