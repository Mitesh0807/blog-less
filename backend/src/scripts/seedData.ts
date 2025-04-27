import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import Post from "../models/Post";
import Tag from "../models/Tag";
import config from "../config/config";
import logger from "../utils/logger";
import crypto from "crypto";

if (config.NODE_ENV !== "production") {
  require("dotenv").config();
}

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info("MongoDB Connected...");
  } catch (err: any) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
};

const generateRandomString = (length = 6) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

const users = [
  {
    name: "Admin User",
    username: "admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    bio: "Platform administrator",
  },
  {
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    password: "password123",
    role: "user",
    bio: "Software developer passionate about web technologies",
  },
  {
    name: "Jane Smith",
    username: "janesmith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
    bio: "Digital marketer and content creator",
  },
];

const tags = [
  {
    name: "javascript",
    slug: "javascript",
    description: "All things JavaScript",
  },
  {
    name: "react",
    slug: "react",
    description: "React.js framework and ecosystem",
  },
  {
    name: "nodejs",
    slug: "nodejs",
    description: "Node.js runtime and server-side JavaScript",
  },
  {
    name: "typescript",
    slug: "typescript",
    description: "TypeScript language and tooling",
  },
  {
    name: "web development",
    slug: "web-development",
    description: "General web development topics",
  },
  {
    name: "design",
    slug: "design",
    description: "UI/UX design principles and tools",
  },
];

const postTitles = [
  "Getting Started with Web Development",
  "Introduction to JavaScript",
  "The Power of TypeScript",
  "Building Modern UIs with React",
  "Node.js for Backend Development",
  "CSS Tricks Every Developer Should Know",
  "Responsive Design Best Practices",
  "RESTful API Design Guidelines",
  "Understanding Async/Await in JavaScript",
  "Introduction to GraphQL",
  "The State of Frontend Development",
  "Web Security Essentials",
  "Performance Optimization Techniques",
  "Mastering Git and GitHub",
  "Testing Strategies for Web Applications",
  "Progressive Web Apps Explained",
  "The Future of Web Development",
  "Database Design for Web Apps",
  "UI/UX Design Principles",
  "Accessibility in Web Design",
];

const generatePosts = (
  authorId: mongoose.Types.ObjectId,
  numPosts: number,
  userIndex: number,
) => {
  const posts: any[] = [];

  const shuffledTitles = [...postTitles].sort(() => 0.5 - Math.random());

  for (let i = 0; i < numPosts; i++) {
    const titleIndex = (userIndex * 10 + i) % shuffledTitles.length;
    const title =
      shuffledTitles[titleIndex] +
      (userIndex > 0 ? ` - Part ${userIndex}` : "");

    const uniqueId = generateRandomString(6);
    const slug = `${createSlug(title)}-${uniqueId}`;

    const randomTags = tags
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map((tag) => tag.name);

    const content = `<p>This is a sample post content for "${title}". It contains some <strong>formatted text</strong> and demonstrates how the content would look.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna ultricies fermentum. Cras aliquet, nisl ut semper sagittis, libero libero hendrerit justo, ut tincidunt nisl nisl ut sem.</p>`;

    posts.push({
      title,
      slug,
      content,
      summary: `This is a sample post about ${title}. It gives a brief summary of the post content.`,
      status: Math.random() > 0.2 ? "published" : "draft",
      author: authorId,
      tags: randomTags,
      featured: Math.random() > 0.8,
      views: Math.floor(Math.random() * 1000),
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      likes: [],
      publishedAt: Math.random() > 0.2 ? new Date() : undefined,
    });
  }

  return posts;
};

const seedData = async () => {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Tag.deleteMany({});

    logger.info("Previous data cleared");

    const createdTags = await Tag.create(tags);
    logger.info(`${createdTags.length} tags created`);

    const createdUsers: any[] = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      const newUser = await User.create({
        ...user,
        password: hashedPassword,
      });

      createdUsers.push(newUser);
    }

    logger.info(`${createdUsers.length} users created`);

    let totalPosts = 0;
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const numPosts = Math.floor(Math.random() * 5) + 3;
      const posts = generatePosts(user._id, numPosts, i);

      for (const post of posts) {
        try {
          await Post.create(post);
          totalPosts++;

          for (const tagName of post.tags) {
            await Tag.findOneAndUpdate(
              { name: tagName },
              { $inc: { postCount: 1 } },
            );
          }
        } catch (error: any) {
          logger.error(`Error creating post: ${error.message}`);
        }
      }
    }

    logger.info(`${totalPosts} posts created`);

    logger.info("Database seeded successfully!");

    return {
      users: createdUsers.length,
      posts: totalPosts,
      tags: createdTags.length,
    };
  } catch (err: any) {
    logger.error(`Error seeding data: ${err.message}`);
    throw err;
  }
};

const runSeed = async () => {
  try {
    await connectDB();
    const result = await seedData();
    logger.info(
      `Seeding completed: Created ${result.users} users, ${result.posts} posts, and ${result.tags} tags`,
    );
    process.exit(0);
  } catch (err: any) {
    logger.error(`Error in seed process: ${err.message}`);
    process.exit(1);
  }
};

runSeed();
