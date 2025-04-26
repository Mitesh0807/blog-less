import { Request, Response, NextFunction } from "express";

export const validatePostCreate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, content } = req.body;
  const errors: string[] = [];

  if (!title || title.trim() === "") {
    errors.push("Title is required");
  }

  if (!content || content.trim() === "") {
    errors.push("Content is required");
  }

  if (title && title.length > 100) {
    errors.push("Title cannot exceed 100 characters");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      errors,
    });
    return;
  }

  next();
};

export const validatePostUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, content } = req.body;
  const errors: string[] = [];

  if (title && title.trim() === "") {
    errors.push("Title cannot be empty");
  }

  if (content && content.trim() === "") {
    errors.push("Content cannot be empty");
  }

  if (title && title.length > 100) {
    errors.push("Title cannot exceed 100 characters");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      errors,
    });
    return;
  }

  next();
};