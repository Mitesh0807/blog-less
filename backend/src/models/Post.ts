import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./User";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  summary: string;
  author: mongoose.Types.ObjectId | IUser;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  status: "draft" | "published" | "archived";
  featured: boolean;
  likes: mongoose.Types.ObjectId[] | IUser[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface IPostModel extends Model<IPost> {
  findRelated(postId: string, limit?: number): Promise<IPost[]>;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [100, "Content must be at least 100 characters long"],
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
      maxlength: [300, "Summary cannot exceed 300 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    coverImage: {
      type: String,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ featured: 1, publishedAt: -1 });

postSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
  }

  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  next();
});

postSchema.statics.findRelated = async function (
  postId: string,
  limit: number = 3,
): Promise<IPost[]> {
  const post = await this.findById(postId);
  if (!post) return [];

  return this.find({
    _id: { $ne: post._id },
    status: "published",
    tags: { $in: post.tags },
  })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

const Post = mongoose.model<IPost, IPostModel>("Post", postSchema);

export default Post;
