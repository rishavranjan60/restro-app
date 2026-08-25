import express from "express";
import cors from "cors";

import connectDB from "./db";
import foodRoutes from "./routes/food.routes";
import orderRoutes from "./routes/order.routes";
import tableRoutes from "./routes/table.routes";
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:3000,http://localhost:3001"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

/*
 * Connect to MongoDB before processing API requests.
 * connectDB() reuses the connection during warm Lambda invocations.
 */
app.use("/api", async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Global error:", error);

    res.status(500).json({
      message: error.message || "Internal Server Error"
    });
  }
);

export default app;