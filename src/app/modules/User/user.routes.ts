import express, { Request, Response } from 'express';
import { userController } from './user.controller';

const router = express()

router.post("/",userController.createAdmin)

export const userRoutes = router