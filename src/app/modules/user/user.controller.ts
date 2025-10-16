import { NextFunction, Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";

const userService = new UserService();

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);

  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Patient created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createDoctor(req);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Doctor created successfully",
      data: result,
    });
  }
);

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createAdmin(req);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Admin created successfully",
      data: result,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, sortBy, sortOrder,searchTerm } = req.query;
    const result = await userService.getAllUsers({
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
      searchTerm
    });

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Users retrieve successfully",
      data: result,
    });
  }
);

export const userController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUsers,
};
