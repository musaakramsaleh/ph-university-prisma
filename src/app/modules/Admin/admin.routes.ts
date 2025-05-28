
import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { update } from "./admin.validation";


const router = express.Router();
router.get('/',AdminController.getAllFromDB)
router.get('/:id',AdminController.getSingleAdmin)
router.patch('/:id',validateRequest(update),AdminController.updateAdmin)
router.delete('/:id',AdminController.deleteAdmin)
router.delete('/soft/:id',AdminController.softDeleteAdmin)
export const AdminRoutes = router;