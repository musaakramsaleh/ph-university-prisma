import express from 'express';
import { userController } from './user.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma';



const router = express()

router.post("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),userController.createAdmin)

export const userRoutes = router