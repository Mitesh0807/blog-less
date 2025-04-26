import express from "express";
import {
  getTags,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag,
  getPopularTags,
} from "../controllers/tagController";
import { protect, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/controllerWrapper";

const router = express.Router();

router.get("/popular", asyncHandler(getPopularTags));

router
  .route("/")
  .get(asyncHandler(getTags))
  .post(protect, authorize("admin"), asyncHandler(createTag));

router
  .route("/:id")
  .put(protect, authorize("admin"), asyncHandler(updateTag))
  .delete(protect, authorize("admin"), asyncHandler(deleteTag));

router.get("/:slug", asyncHandler(getTagBySlug));

export default router;
