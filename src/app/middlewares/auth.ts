import { NextFunction, Request, Response } from "express";
import status from "http-status";
import config from "../../config";
import ApiError from "../errors/ApiError";
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
        throw new ApiError(status.UNAUTHORIZED, "You are not authorized!");
      }

      const verifyUser = verifyToken(token, config.jwt.accessSecret as string);
      req.user = verifyUser;

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(status.UNAUTHORIZED, "You are not authorized!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
