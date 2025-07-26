import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

console.log("🌩️ Cloudinary config loaded:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "✔️ loaded" : "❌ missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✔️ loaded" : "❌ missing",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'restaurant-menu',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  }),
});

const upload = multer({ storage });

export { cloudinary, storage, upload };
