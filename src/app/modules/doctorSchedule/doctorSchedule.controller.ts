import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorScheduleService } from "./doctorSchedule.service";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await doctorScheduleService.insertIntoDB(user, req.body);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Doctor Schedule Created Successfully",
      data: result,
    });
  }
);

export const doctorScheduleController = {
  insertIntoDB,
};
