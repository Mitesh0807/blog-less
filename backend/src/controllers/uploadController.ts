import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import logger from "../utils/logger";
import {
  generateThumbnail,
  optimizeImage,
  generateResponsiveSizes
} from "../utils/imageStorage";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.file;
    const uploadType = req.query.type || "posts";
    const filename = file.filename;
    const filePath = file.path;

    // Optimize the original image
    await optimizeImage(filePath);

    // Generate thumbnail
    const thumbnailPath = await generateThumbnail(filePath, filename);
    const thumbnailUrl = `/uploads/thumbnails/thumb-${filename}`;

    // Generate responsive sizes
    const responsiveUrls = await generateResponsiveSizes(filePath, filename);

    // Create response URLs
    const baseUrl = `/uploads/${uploadType === "profile" ? "profiles" : "posts"}/${filename}`;

    logger.info(`Image uploaded: ${filename} by user ${req.user?._id}`);

    res.status(200).json({
      success: true,
      data: {
        filename,
        url: baseUrl,
        thumbnailUrl,
        responsiveUrls,
      },
    });
  } catch (error: any) {
    logger.error(`Error uploading image: ${error.message}`, error);
    next(error);
  }
};

export const deleteUploadedImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    // Check if file exists
    const uploadType = req.query.type || "posts";
    const baseDir = path.join(process.cwd(), "uploads", uploadType === "profile" ? "profiles" : "posts");
    const filePath = path.join(baseDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Remove original file
    fs.unlinkSync(filePath);

    // Remove thumbnail if exists
    const thumbnailPath = path.join(process.cwd(), "uploads", "thumbnails", `thumb-${filename}`);
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }

    // Remove responsive images if exist
    const baseName = path.parse(filename).name;
    const responsiveDir = path.join(process.cwd(), "uploads", "responsive");

    if (fs.existsSync(responsiveDir)) {
      const files = fs.readdirSync(responsiveDir);

      for (const file of files) {
        if (file.startsWith(baseName)) {
          fs.unlinkSync(path.join(responsiveDir, file));
        }
      }
    }

    logger.info(`Image deleted: ${filename} by user ${req.user?._id}`);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error: any) {
    logger.error(`Error deleting image: ${error.message}`, error);
    next(error);
  }
};