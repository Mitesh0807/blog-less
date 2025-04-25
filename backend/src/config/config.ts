import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import logger from "../utils/logger";
import { Algorithm } from "jsonwebtoken";

dotenv.config();

interface EnvConfig {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string | number;
  JWT_ALGORITHM: Algorithm;
  COOKIE_EXPIRES_IN: number;
}

//TODO:need to handel proper way
const defaults: EnvConfig = {
  NODE_ENV: "development",
  PORT: 8080,
  MONGODB_URI: "mongodb://127.0.0.1:27017/blog-platform",
  JWT_SECRET: "secret",
  JWT_EXPIRES_IN: "30d",
  JWT_ALGORITHM: "HS256",
  COOKIE_EXPIRES_IN: 30,
};

function getEnvVar<T>(
  key: keyof EnvConfig,
  defaultValue: T,
  convertFn?: (value: string) => T,
): T {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  if (convertFn) {
    try {
      return convertFn(value);
    } catch (error) {
      logger.warn(`Error converting environment variable ${key}: ${error}`);
      return defaultValue;
    }
  }

  return value as unknown as T;
}

function validateJwtAlgorithm(value: string): Algorithm {
  const validAlgorithms: Algorithm[] = [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512",
    "PS256",
    "PS384",
    "PS512",
    "none",
  ];

  if (validAlgorithms.includes(value as Algorithm)) {
    return value as Algorithm;
  }

  logger.warn(`Invalid JWT algorithm: ${value}, using default HS256`);
  return "HS256";
}

const config: EnvConfig = {
  NODE_ENV: getEnvVar("NODE_ENV", defaults.NODE_ENV) as
    | "development"
    | "production"
    | "test",
  PORT: getEnvVar("PORT", defaults.PORT, (v) => parseInt(v, 10)),
  MONGODB_URI: getEnvVar("MONGODB_URI", defaults.MONGODB_URI),
  JWT_SECRET: getEnvVar("JWT_SECRET", defaults.JWT_SECRET),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", defaults.JWT_EXPIRES_IN),
  JWT_ALGORITHM: getEnvVar(
    "JWT_ALGORITHM",
    defaults.JWT_ALGORITHM,
    validateJwtAlgorithm,
  ),
  COOKIE_EXPIRES_IN: getEnvVar(
    "COOKIE_EXPIRES_IN",
    defaults.COOKIE_EXPIRES_IN,
    (v) => parseInt(v, 10),
  ),
};

function validateConfig() {
  const issues: string[] = [];

  if (
    config.NODE_ENV === "production" &&
    config.JWT_SECRET === defaults.JWT_SECRET
  ) {
    issues.push("JWT_SECRET is using default value in production environment");
  }

  if (!config.MONGODB_URI) {
    issues.push("MONGODB_URI is required");
  }

  if (issues.length > 0) {
    issues.forEach((issue) => logger.error(`Configuration error: ${issue}`));

    if (config.NODE_ENV === "production") {
      throw new Error("Invalid configuration for production environment");
    }
  }
}

export function bootstrapConfig() {
  const logsDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  validateConfig();

  logger.info("Application configuration loaded", {
    environment: config.NODE_ENV,
    port: config.PORT,
    database: config.MONGODB_URI.split("@").pop(),
    jwtExpiresIn: config.JWT_EXPIRES_IN,
    jwtAlgorithm: config.JWT_ALGORITHM,
    cookieExpiresIn: `${config.COOKIE_EXPIRES_IN} days`,
  });
}

export default config;
