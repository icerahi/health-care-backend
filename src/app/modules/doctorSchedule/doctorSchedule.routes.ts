import { UserRole } from "@prisma/client";
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { doctorScheduleController } from "./doctorSchedule.controller";
import { createDoctorScheduleValidationSchema } from "./doctorSchedule.validation";

const router = Router();

router.get("/", auth(UserRole.DOCTOR), doctorScheduleController.mySchedules);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(createDoctorScheduleValidationSchema),
  doctorScheduleController.insertIntoDB
);

export const doctorScheduleRoutes = router;
