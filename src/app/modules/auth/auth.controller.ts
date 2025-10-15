import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { authService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, needPasswordChange } =
    await authService.login(req.body);

  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 90,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: { needPasswordChange },
  });
});

export const authController = {
  login,
};
