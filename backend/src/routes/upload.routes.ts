import express, {
  Request,
  Response,
} from "express";
import {
  upload,
  uploadImage,
} from "../utils/cloudinary";
import { requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/",
  requireAdmin,
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        error: "No valid file uploaded",
      });
      return;
    }

    try {
      const result = await uploadImage(req.file.buffer);

      res.status(200).json({
        url: result.secure_url,
      });
    } catch (error) {
      console.error("Upload failed:", error);

      res.status(500).json({
        error: "Upload failed",
      });
    }
  }
);

export default router;