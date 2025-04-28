import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import logger from "../utils/logger";
import config from "../config/config";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  bio?: string;
  username: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

const cookieOptions = {
  expires: new Date(
    Date.now() + config.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  ),
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
};

const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  const token = user.generateAuthToken();

  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    user: userObj,
    token,
  });

  logger.info(`User authenticated: ${user._id}`);
};

export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, bio, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration failed: Email already exists - ${email}`);
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      bio,
      username,
    });

    logger.info(`New user registered: ${email}`);

    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    logger.error(`Registration error: ${error.message}`, error);
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.warn("Login attempt without email or password");
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
      return;
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      logger.warn(`Login failed: Invalid credentials for ${email}`);
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid password for ${email}`);
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    logger.info(`User logged in: ${email}`);

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`, error);
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    logger.debug(`User profile accessed: ${user?._id}`);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    logger.error(`Get user profile error: ${error.message}`, error);
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`User logged out: ${req.user?._id}`);

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    logger.error(`Logout error: ${error.message}`, error);
    next(error);
  }
};
