import express from "express";
import {
  getCurrentProfile,
  createOrUpdateProfile,
  getProfiles,
  getProfileByUserId,
  getProfileByUsername,
  deleteProfile,
} from "../controllers/profileController";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../utils/controllerWrapper";

const router = express.Router();

router.get("/me", protect, asyncHandler(getCurrentProfile));
router.post("/", protect, asyncHandler(createOrUpdateProfile));
router.delete("/", protect, asyncHandler(deleteProfile));

router.get("/", asyncHandler(getProfiles));

router.get("/user/:userId", asyncHandler(getProfileByUserId));
router.get("/username/:username", asyncHandler(getProfileByUsername));

export default router;
