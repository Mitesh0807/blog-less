import { Request, Response, NextFunction } from "express";
import Tag from "../models/Tag";
import Post from "../models/Post";
import logger from "../utils/logger";

export const getTags = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sort = "-postCount", limit = 20 } = req.query;

    const tags = await Tag.find()
      .sort(sort as string)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags,
    });
  } catch (error: any) {
    logger.error(`Error getting tags: ${error.message}`, error);
    next(error);
  }
};

export const getTagBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    const posts = await Post.find({
      tags: tag.name,
      status: "published",
    })
      .populate("author", "name username")
      .sort("-publishedAt")
      .limit(10);

    res.status(200).json({
      success: true,
      data: tag,
      posts,
    });
  } catch (error: any) {
    logger.error(`Error getting tag: ${error.message}`, error);
    next(error);
  }
};

export const createTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingTag = await Tag.findOne({
      name: req.body.name.toLowerCase().trim(),
    });

    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: "Tag already exists",
      });
    }

    const tag = await Tag.create({
      name: req.body.name.toLowerCase().trim(),
      description: req.body.description,
    });

    logger.info(`Tag created: ${tag.name} by user ${req.user?._id}`);

    res.status(201).json({
      success: true,
      data: tag,
    });
  } catch (error: any) {
    logger.error(`Error creating tag: ${error.message}`, error);
    next(error);
  }
};

export const updateTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    if (req.body.name && req.body.name.toLowerCase().trim() !== tag.name) {
      await Post.updateMany(
        { tags: tag.name },
        { $set: { "tags.$": req.body.name.toLowerCase().trim() } },
      );
    }

    tag = await Tag.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name ? req.body.name.toLowerCase().trim() : tag.name,
        description: req.body.description,
      },
      { new: true, runValidators: true },
    );

    logger.info(`Tag updated: ${tag?._id} by user ${req.user?._id}`);

    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error: any) {
    logger.error(`Error updating tag: ${error.message}`, error);
    next(error);
  }
};

export const deleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    await Post.updateMany({ tags: tag.name }, { $pull: { tags: tag.name } });

    await tag.deleteOne();

    logger.info(`Tag deleted: ${tag.name} by user ${req.user?._id}`);

    res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error: any) {
    logger.error(`Error deleting tag: ${error.message}`, error);
    next(error);
  }
};

export const getPopularTags = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const tags = await Tag.find().sort("-postCount").limit(limit);

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags,
    });
  } catch (error: any) {
    logger.error(`Error getting popular tags: ${error.message}`, error);
    next(error);
  }
};
