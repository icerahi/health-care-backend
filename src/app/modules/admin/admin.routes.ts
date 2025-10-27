import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/", adminController.getAllFromDB);
router.patch("/:id", adminController.updateIntoDB);

export const adminRoutes = router;
