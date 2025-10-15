import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../utils/fileUploader";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";

const router = Router();

router.post(
  "/create-patient",

  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return userController.createPatient(req, res, next);
  }
);

//create doctor
router.post(
  "/create-doctor",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return userController.createDoctor(req, res, next);
  }
);

//create admin
router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return userController.createAdmin(req, res, next);
  }
);

export const userRoutes = router;
