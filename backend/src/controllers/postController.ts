import mongoose from "mongoose";
import Post from "../models/Post";
import Tag from "../models/Tag";
import Comment from "../models/Comment";
import logger from "../utils/logger";
import { IUser } from "../models/User";
import { NextFunction, Response, Request } from "express";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = req.user as IUser;
    req.body.author = user._id;

    if (req.body.tags && Array.isArray(req.body.tags)) {
      req.body.tags = [
        ...new Set(
          req.body.tags.map((tag: string) => tag.toLowerCase().trim()),
        ),
      ];

      await Promise.all(
        req.body.tags.map(async (tagName: string) => {
          await Tag.findOneAndUpdate(
            { name: tagName },
            { name: tagName, $inc: { postCount: 1 } },
            { upsert: true, new: true },
          );
        }),
      );
    }

    const post = await Post.create(req.body);

    logger.info(`Post created: ${post._id} by user ${user._id}`);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    logger.error(`Error creating post: ${error.message}`, error);
    next(error);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      author,
      tag,
      status = "published",
      featured,
      search,
    } = req.query;

    let query: any = {};

    const user = req.user as IUser | undefined;

    if (!user || user.role !== "admin") {
      query.status = "published";
    } else if (status) {
      query.status = status;
    }

    if (author) {
      query.author = author;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate("author", "name username")
      .sort(sort as string)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: posts.length,
      total: totalPosts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalPosts / Number(limit)),
      },
      data: posts,
    });
  } catch (error: any) {
    logger.error(`Error getting posts: ${error.message}`, error);
    next(error);
  }
};

export const getPostBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("author", "name username bio profilePicture")
      .populate({
        path: "likes",
        select: "name username",
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const postAuthor = post.author as unknown as { _id: mongoose.Types.ObjectId };
    const user = req.user as IUser & { _id: mongoose.Types.ObjectId } | undefined;

    if (
      post.status !== "published" &&
      (!user ||
        (user._id.toString() !== postAuthor._id.toString() &&
          user.role !== "admin"))
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this post",
      });
    }

    post.views += 1;
    await post.save();

    const postId = post._id as mongoose.Types.ObjectId;
    const relatedPosts = await Post.findRelated(postId.toString());

    const comments = await Comment.find({ post: post._id, parent: null })
      .populate("author", "name username profilePicture")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: post,
      relatedPosts,
      comments,
    });
  } catch (error: any) {
    logger.error(`Error getting post by slug: ${error.message}`, error);
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = req.user as IUser & { _id: mongoose.Types.ObjectId };

    if (
      post.author.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    if (req.body.tags && Array.isArray(req.body.tags)) {
      const oldTags = [...post.tags];

      const newTags = [
        ...new Set(
          req.body.tags.map((tag: string) => tag.toLowerCase().trim()),
        ),
      ];

      const tagsToRemove = oldTags.filter(
        (tag) => !newTags.includes(tag.toString())
      );

      const tagsToAdd = newTags.filter((tag) => !oldTags.includes(tag as string));

      await Promise.all([
        ...tagsToRemove.map(async (tagName) => {
          await Tag.findOneAndUpdate(
            { name: tagName },
            { $inc: { postCount: -1 } },
          );
        }),
        ...tagsToAdd.map(async (tagName) => {
          await Tag.findOneAndUpdate(
            { name: tagName },
            { name: tagName, $inc: { postCount: 1 } },
            { upsert: true, new: true },
          );
        }),
      ]);

      req.body.tags = newTags;
    }

    if (req.body.status === "published" && post.status !== "published") {
      req.body.publishedAt = new Date();
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("author", "name username");

    logger.info(`Post updated: ${post?._id} by user ${user._id}`);

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    logger.error(`Error updating post: ${error.message}`, error);
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = req.user as IUser & { _id: mongoose.Types.ObjectId };

    if (
      post.author.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await post.deleteOne({ session });

      await Promise.all(
        post.tags.map(async (tagName) => {
          await Tag.findOneAndUpdate(
            { name: tagName },
            { $inc: { postCount: -1 } },
            { session },
          );
        }),
      );

      await Comment.deleteMany({ post: post._id }, { session });

      await session.commitTransaction();
      session.endSession();

      logger.info(`Post deleted: ${post._id} by user ${user._id}`);

      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error: any) {
    logger.error(`Error deleting post: ${error.message}`, error);
    next(error);
  }
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = req.user as IUser & { _id: mongoose.Types.ObjectId };

    const liked = post.likes.some(
      (like) => like.toString() === user._id.toString(),
    );

    if (liked) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== user._id.toString(),
      ) as any;

      logger.info(`Post unliked: ${post._id} by user ${user._id}`);
    } else {
      post.likes.push(user._id as any);
      logger.info(`Post liked: ${post._id} by user ${user._id}`);
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !liked,
      likesCount: post.likes.length,
    });
  } catch (error: any) {
    logger.error(`Error liking post: ${error.message}`, error);
    next(error);
  }
};

export const getFeaturedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const featuredPosts = await Post.find({
      status: "published",
      featured: true,
    })
      .populate("author", "name username")
      .sort("-publishedAt")
      .limit(6);

    res.status(200).json({
      success: true,
      count: featuredPosts.length,
      data: featuredPosts,
    });
  } catch (error: any) {
    logger.error(`Error getting featured posts: ${error.message}`, error);
    next(error);
  }
};

export const getRecommendedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = req.user as IUser;

    const userProfile = await mongoose.model("Profile").findOne({
      user: user._id,
    });

    const interests = userProfile?.interests || [];

    const recommendedPosts = await Post.find({
      status: "published",
      tags: { $in: interests },
    })
      .populate("author", "name username")
      .sort("-publishedAt")
      .limit(10);

    res.status(200).json({
      success: true,
      count: recommendedPosts.length,
      data: recommendedPosts,
    });
  } catch (error: any) {
    logger.error(`Error getting recommended posts: ${error.message}`, error);
    next(error);
  }
};
