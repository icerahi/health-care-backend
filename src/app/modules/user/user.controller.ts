import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../utils/pick";
import { userFilterableFields } from "./user.constant";
import { UserService } from "./user.service";

const userService = new UserService();

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Patient created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createDoctor(req);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
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
      statusCode: httpStatus.CREATED,
      message: "Admin created successfully",
      data: result,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
 
    const filters = pick(req.query, userFilterableFields); //searching and filtering
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);//paginatin and sorting

    const result = await userService.getAllUsers(filters, options);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieve successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const userController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUsers,
};
