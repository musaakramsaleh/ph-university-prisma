import express from 'express';
import { userController } from './user.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma';
import { upload } from '../../../helpers/fileUploader';


const router = express()
router.post("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),upload.single('file'),userController.createAdmin)

export const userRoutes = router