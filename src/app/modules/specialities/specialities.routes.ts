import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";

import { auth } from "../../middlewares/auth";
import { fileUploader } from "../../utils/fileUploader";
import { SpecialitiesController } from "./specialities.controller";
import { SpecialitiesValidtaion } from "./specialities.validation";

const router = express.Router();

router.get("/", SpecialitiesController.getAllFromDB);

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialitiesValidtaion.create.parse(JSON.parse(req.body.data));
    return SpecialitiesController.inserIntoDB(req, res, next);
  }
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.ADMIN),
  SpecialitiesController.deleteFromDB
);

export const SpecialitiesRoutes = router;
