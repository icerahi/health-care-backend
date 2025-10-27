import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../utils/pick";
import { patientFilterableFields } from "./patient.constant";
import { patientService } from "./patient.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await patientService.getAllFromDB(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Doctors retreived Successfully",
    meta: result.meta,
    data: result.data,
  });
});
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.updateIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Doctors updated Successfully",

    data: result,
  });
});

export const patientController = {
  getAllFromDB,
  updateIntoDB,
};
