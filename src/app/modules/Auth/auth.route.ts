import express from "express"
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post("/login",authController.loginUser)
router.post("/refresh-token",authController.refreshToken)
router.post("/change-password",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.PATIENT,UserRole.DOCTOR),authController.changedPassword)
router.post("/forget-password",authController.forgetPassword)
router.post("/reset-password",authController.resetPassword)


export const authRoutes = router