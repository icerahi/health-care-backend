import { Router } from "express";
import { patientController } from "./patient.controller";

const router = Router();

router.get("/", patientController.getAllFromDB);
router.patch("/:id", patientController.updateIntoDB);

export const PatientRoutes = router;
