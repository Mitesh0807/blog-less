import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document {
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      unique: true,
      maxlength: [30, "Tag name cannot exceed 30 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    postCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

tagSchema.index({ postCount: -1 });

tagSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

const Tag = mongoose.model<ITag>("Tag", tagSchema);

export default Tag;
