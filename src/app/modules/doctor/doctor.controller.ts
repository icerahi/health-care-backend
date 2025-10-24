import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../utils/pick";
import { doctorService } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constant";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, doctorFilterableFields);

  const result = await doctorService.getAllFromDB(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Doctor retreived Successfully",
    data: result,
  });
});

export const doctorController = {
  getAllFromDB,
};
