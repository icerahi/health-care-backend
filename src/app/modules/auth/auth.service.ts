import { UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import status from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import { generateToken } from "../../utils/jwtHelper";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email, status: UserStatus.ACTIVE },
  });

  const checkPassword = await bcrypt.compare(payload.password, user.password);

  if (!checkPassword) {
    throw new ApiError(status.BAD_REQUEST, "Password is incorrect!");
  }

  const userInfo: JwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    userInfo,
    config.jwt.accessSecret as string,
    config.jwt.accessExpire as string
  );

  const refreshToken = generateToken(
    userInfo,
    config.jwt.refreshSecret as string,
    config.jwt.refreshExpire as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const authService = {
  login,
};
