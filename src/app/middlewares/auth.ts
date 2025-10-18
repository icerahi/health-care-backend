import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { verifyToken } from "../utils/jwtHelper";

export const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new Error("You are not authorized!");
      }

      const verifyUser = verifyToken(token, config.jwt.accessSecret as string);
      req.user = verifyUser;

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new Error("You are not authorized!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
