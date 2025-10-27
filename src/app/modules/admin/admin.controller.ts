import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../utils/pick";
import { adminService } from "./admin.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await adminService.getAllFromDB(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin retreived Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.updateIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin updated Successfully",

    data: result,
  });
});

export const adminController = {
  getAllFromDB,
  updateIntoDB,
};
