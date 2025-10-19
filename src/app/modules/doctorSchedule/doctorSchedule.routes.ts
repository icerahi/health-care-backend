import { UserRole } from "@prisma/client";
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { doctorScheduleController } from "./doctorSchedule.controller";

const router = Router();

router.post("/", auth(UserRole.DOCTOR), doctorScheduleController.insertIntoDB);

export const doctorScheduleRoutes = router;
