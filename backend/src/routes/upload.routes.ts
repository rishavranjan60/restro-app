import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/"); // Save to uploads/ directory
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// ✅ POST /api/upload
router.post("/", upload.single("file"), function (req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  res.status(200).json({ url: `http://localhost:5000/uploads/${req.file.filename}` });
});

export default router;
