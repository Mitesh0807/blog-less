import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { Request } from "express";
import logger from "./logger";

// Ensure upload directories exist
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const POST_IMAGES_DIR = path.join(UPLOAD_DIR, "posts");
const PROFILE_IMAGES_DIR = path.join(UPLOAD_DIR, "profiles");
const THUMBNAIL_DIR = path.join(UPLOAD_DIR, "thumbnails");

// Create directories if they don't exist
[UPLOAD_DIR, POST_IMAGES_DIR, PROFILE_IMAGES_DIR, THUMBNAIL_DIR].forEach(
  (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    // Determine destination based on upload type
    const uploadType = req.query.type || "posts";
    let uploadPath = POST_IMAGES_DIR;

    if (uploadType === "profile") {
      uploadPath = PROFILE_IMAGES_DIR;
    }

    cb(null, uploadPath);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    // Generate unique filename
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

// File filter to only allow images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG and WebP images are allowed."));
  }
};

// Configure multer upload
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

// Function to generate thumbnail
export const generateThumbnail = async (
  filePath: string,
  filename: string,
  width = 300
): Promise<string> => {
  try {
    const thumbnailPath = path.join(THUMBNAIL_DIR, `thumb-${filename}`);

    await sharp(filePath)
      .resize(width)
      .webp({ quality: 80 })
      .toFile(thumbnailPath);

    return thumbnailPath;
  } catch (error: any) {
    logger.error(`Error generating thumbnail: ${error.message}`);
    throw error;
  }
};

// Function to optimize image
export const optimizeImage = async (
  filePath: string,
  quality = 80
): Promise<void> => {
  try {
    const optimizedImage = await sharp(filePath)
      .webp({ quality })
      .toBuffer();

    // Replace original with optimized version
    await fs.promises.writeFile(filePath, optimizedImage);
  } catch (error: any) {
    logger.error(`Error optimizing image: ${error.message}`);
    throw error;
  }
};

// Function to generate multiple image sizes for responsive loading
export const generateResponsiveSizes = async (
  filePath: string,
  filename: string
): Promise<{[key: string]: string}> => {
  try {
    const sizes = [640, 768, 1024, 1280];
    const results: {[key: string]: string} = {};

    for (const size of sizes) {
      const resizedFilename = `${path.parse(filename).name}-${size}${path.extname(filename)}`;
      const resizedPath = path.join(UPLOAD_DIR, "responsive", resizedFilename);

      // Create directory if it doesn't exist
      const dir = path.dirname(resizedPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await sharp(filePath)
        .resize(size)
        .webp({ quality: 80 })
        .toFile(resizedPath);

      results[`${size}`] = `/uploads/responsive/${resizedFilename}`;
    }

    return results;
  } catch (error: any) {
    logger.error(`Error generating responsive images: ${error.message}`);
    throw error;
  }
};

// Function to delete image and its associated files
export const deleteImage = async (filename: string): Promise<void> => {
  try {
    const filePaths = [
      path.join(POST_IMAGES_DIR, filename),
      path.join(PROFILE_IMAGES_DIR, filename),
      path.join(THUMBNAIL_DIR, `thumb-${filename}`),
    ];

    for (const filePath of filePaths) {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }

    // Delete responsive images if they exist
    const responsiveDir = path.join(UPLOAD_DIR, "responsive");
    if (fs.existsSync(responsiveDir)) {
      const baseFilename = path.parse(filename).name;
      const files = await fs.promises.readdir(responsiveDir);

      for (const file of files) {
        if (file.startsWith(baseFilename)) {
          await fs.promises.unlink(path.join(responsiveDir, file));
        }
      }
    }
  } catch (error: any) {
    logger.error(`Error deleting image: ${error.message}`);
    throw error;
  }
};