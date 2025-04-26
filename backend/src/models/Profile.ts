import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./User";

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId | IUser;
  bio: string;
  occupation?: string;
  company?: string;
  website?: string;
  location?: string;
  skills: string[];
  social: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
    github?: string;
  };
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    occupation: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        "Please provide a valid URL",
      ],
    },
    location: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    social: {
      twitter: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
      linkedin: {
        type: String,
        trim: true,
      },
      youtube: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
    },
    interests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

profileSchema.index({ skills: 1 });
profileSchema.index({ interests: 1 });

const Profile = mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;
