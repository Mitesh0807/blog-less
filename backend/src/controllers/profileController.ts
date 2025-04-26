import { Request, Response, NextFunction } from "express";
import Profile from "../models/Profile";
import User from "../models/User";
import Post from "../models/Post";
import logger from "../utils/logger";

export const getCurrentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await Profile.findOne({ user: req.user?._id }).populate(
      "user",
      "name username email role profilePicture",
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    logger.error(`Error getting current profile: ${error.message}`, error);
    next(error);
  }
};

export const createOrUpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profileFields: any = {
      user: req.user?._id,
      bio: req.body.bio,
      occupation: req.body.occupation,
      company: req.body.company,
      website: req.body.website,
      location: req.body.location,
      skills: req.body.skills
        ? req.body.skills.split(",").map((skill: string) => skill.trim())
        : [],
      interests: req.body.interests
        ? req.body.interests
            .split(",")
            .map((interest: string) => interest.trim())
        : [],
    };

    profileFields.social = {};
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.github) profileFields.social.github = req.body.github;

    let profile = await Profile.findOne({ user: req.user?._id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user?._id },
        { $set: profileFields },
        { new: true, runValidators: true },
      ).populate("user", "name username email profilePicture");

      logger.info(`Profile updated: User ${req.user?._id}`);
    } else {
      profile = await Profile.create(profileFields);
      await profile.populate("user", "name username email profilePicture");

      logger.info(`Profile created: User ${req.user?._id}`);
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    logger.error(`Error creating/updating profile: ${error.message}`, error);
    next(error);
  }
};

export const getProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalProfiles = await Profile.countDocuments();

    const profiles = await Profile.find()
      .populate("user", "name username email profilePicture")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: profiles.length,
      total: totalProfiles,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalProfiles / Number(limit)),
      },
      data: profiles,
    });
  } catch (error: any) {
    logger.error(`Error getting profiles: ${error.message}`, error);
    next(error);
  }
};

export const getProfileByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "user",
      "name username email profilePicture",
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const posts = await Post.find({
      author: req.params.userId,
      status: "published",
    })
      .sort("-publishedAt")
      .limit(5);

    res.status(200).json({
      success: true,
      data: profile,
      posts,
    });
  } catch (error: any) {
    logger.error(`Error getting profile by user ID: ${error.message}`, error);
    next(error);
  }
};

export const getProfileByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await Profile.findOne({ user: user._id }).populate(
      "user",
      "name username email profilePicture",
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const posts = await Post.find({
      author: user._id,
      status: "published",
    })
      .sort("-publishedAt")
      .limit(5);

    res.status(200).json({
      success: true,
      data: profile,
      posts,
    });
  } catch (error: any) {
    logger.error(`Error getting profile by username: ${error.message}`, error);
    next(error);
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Post.deleteMany({ author: req.user?._id });

    await Profile.findOneAndDelete({ user: req.user?._id });

    await User.findByIdAndDelete(req.user?._id);

    logger.info(`User and profile deleted: ${req.user?._id}`);

    res.status(200).json({
      success: true,
      message: "User and profile deleted successfully",
    });
  } catch (error: any) {
    logger.error(`Error deleting profile and user: ${error.message}`, error);
    next(error);
  }
};
