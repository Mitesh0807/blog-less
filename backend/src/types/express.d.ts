import { IUser } from "../models/User";
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: IUser & {
        _id: Types.ObjectId;
      };
    }
  }
}

export interface AuthenticatedRequest extends Express.Request {
  user: IUser & {
    _id: Types.ObjectId;
  };
}

declare module "express" {
  export interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
  }
}
