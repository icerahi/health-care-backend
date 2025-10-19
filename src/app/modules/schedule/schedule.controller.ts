import { NextFunction, Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import { pick } from "../../utils/pick";
import { scheduleService } from "./schedule.service";

const insertIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await scheduleService.insertIntoDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Schedule created successfully",
      data: result,
    });
  }
);
const schedulesForDoctor = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]); //paginatin and sorting
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);

    const user = req.user;
    const result = await scheduleService.schedulesForDoctor(
      user as IJWTPayload,
      filters,
      options
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Schedule fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await scheduleService.deleteScheduleFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Schedule deleted successfully",
    data: result,
  });
});

export const scheduleController = {
  insertIntoDB,
  schedulesForDoctor,
  deleteScheduleFromDB,
};
