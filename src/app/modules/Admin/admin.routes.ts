
import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { update } from "./admin.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";


const router = express.Router();
router.get('/',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.getAllFromDB)
router.get('/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.getSingleAdmin)
router.patch('/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validateRequest(update),AdminController.updateAdmin)
router.delete('/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.deleteAdmin)
router.delete('/soft/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.softDeleteAdmin)
export const AdminRoutes = router;