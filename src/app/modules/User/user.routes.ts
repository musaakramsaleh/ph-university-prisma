import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma';
import { upload } from '../../../helpers/fileUploader';
import { userValidation } from './user.validation';



const router = express()
router.post("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),upload.single('file'),
(req:Request,res:Response,next:NextFunction) => {
  
  req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
  return userController.createAdmin(req,res,next)
})
router.post("/create-doctor",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),upload.single('file'),
(req:Request,res:Response,next:NextFunction) => {
  
  req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
  return userController.createDoctor(req,res,next)
})
router.post("/create-patient",upload.single('file'),
(req:Request,res:Response,next:NextFunction) => {
  
  req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
  return userController.createPatient(req,res,next)
})
router.get("/users",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),(req:Request,res:Response,next:NextFunction)=>{
  return userController.getAllFromDB(req,res,next)
})

router.patch("/:id/status",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
  (req:Request,res:Response,next:NextFunction)=>{
    req.body = userValidation.userStatus.parse(JSON.parse(req.body.status))
    return userController.changeProfileStatus(req,res,next)
  }
)

export const userRoutes = router