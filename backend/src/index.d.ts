import { Request, Response, NextFunction } from 'express';

// Extend Express module
declare module 'express-serve-static-core' {
  interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
  }
}