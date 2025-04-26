import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";

/**
 * A helper function that wraps controller functions to properly handle async operations
 * and ensure compatibility with Express's RequestHandler type.
 *
 * This solves the TypeScript error where Express expects handlers to return void or Promise<void>,
 * but our controllers may return Response objects.
 */
export const asyncHandler = (fn: Function): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
