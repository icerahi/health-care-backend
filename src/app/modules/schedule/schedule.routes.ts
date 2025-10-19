import { UserRole } from "@prisma/client";
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { scheduleController } from "./schedule.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.DOCTOR, UserRole.ADMIN),
  scheduleController.schedulesForDoctor
);
router.delete("/:id", scheduleController.deleteScheduleFromDB);
router.post("/", scheduleController.insertIntoDB);

export const ScheduleRoutes = router;
