import express from "express";
import {
  createPost,
  getPosts,
  getPostBySlug,
  getPostById,
  getPostsByIds,
  updatePost,
  deletePost,
  likePost,
  getFeaturedPosts,
  getRecommendedPosts,
  getUserPosts,
  getUserPostsStats,
} from "../controllers/postController";
import { protect } from "../middleware/auth";
import { validatePostCreate, validatePostUpdate } from "../validators/postValidator";
import { asyncHandler } from "../utils/controllerWrapper";

const router = express.Router();

router.route("/")
  .get(asyncHandler(getPosts))
  .post(protect, validatePostCreate, asyncHandler(createPost));

router.get("/featured", asyncHandler(getFeaturedPosts));
router.get("/recommended", protect, asyncHandler(getRecommendedPosts));
router.get("/me", protect, asyncHandler(getUserPosts));
router.get("/me/stats", protect, asyncHandler(getUserPostsStats));
router.post("/batch", asyncHandler(getPostsByIds));
router.get("/id/:id", asyncHandler(getPostById));
router.get("/:slug", asyncHandler(getPostBySlug));
router.put("/:id", protect, validatePostUpdate, asyncHandler(updatePost));
router.delete("/:id", protect, asyncHandler(deletePost));
router.put("/:id/like", protect, asyncHandler(likePost));

export default router;
