import express from "express";
import { uploadImage, deleteUploadedImage } from "../controllers/uploadController";
import { protect } from "../middleware/auth";
import { upload } from "../utils/imageStorage";
import { asyncHandler } from "../utils/controllerWrapper";

const router = express.Router();

// Route for uploading images
router.post(
  "/",
  protect,
  upload.single("image"),
  asyncHandler(uploadImage)
);

// Route for deleting images
router.delete(
  "/:filename",
  protect,
  asyncHandler(deleteUploadedImage)
);

export default router;