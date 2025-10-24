import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/doctor", doctorController.getAllFromDB);

export const doctorRoutes = router;
