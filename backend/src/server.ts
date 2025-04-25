import express, { Request, Response, NextFunction, Express } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import logger from "./utils/logger";
import config, { bootstrapConfig } from "./config/config";

bootstrapConfig();

connectDB();

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
    environment: config.NODE_ENV,
  });
});

app.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        message: "Blog platform API is running",
        success: true,
        environment: config.NODE_ENV,
      });
    } catch (error: unknown) {
      next(new Error((error as Error).message));
    }
  },
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  res.status(500).json({
    success: false,
    message: "Server Error",
    error: config.NODE_ENV === "development" ? err.message : undefined,
  });
});

const server = app.listen(config.PORT, () => {
  logger.info(`Server is up and running on port ${config.PORT}`);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received. Shutting down gracefully.");
  server.close(() => {
    logger.info("Closed out remaining connections.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received (Ctrl+C).");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});
