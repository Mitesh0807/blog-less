import { createLogger, format, transports, LoggerOptions } from "winston";
import path from "path";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "warn";
};

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message}${info.meta ? " " + JSON.stringify(info.meta) : ""}`,
  ),
);

const logger = createLogger({
  level: level(),
  levels,
  format: format.combine(format.colorize(), logFormat),
  transports: [
    new transports.Console(),

    new transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join("logs", "combined.log"),
    }),
  ],
});
//TODO:need to figure out proper types
export default {
  error: (message: string, meta?: any) => logger.error(message, { meta }),
  warn: (message: string, meta?: any) => logger.warn(message, { meta }),
  info: (message: string, meta?: any) => logger.info(message, { meta }),
  http: (message: string, meta?: any) => logger.http(message, { meta }),
  debug: (message: string, meta?: any) => logger.debug(message, { meta }),
};
