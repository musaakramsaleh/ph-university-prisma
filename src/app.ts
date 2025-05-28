import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors'
import router from './app/routes';
import globalErrorhandler from './app/middlewares/globalErrorHandler';
import httpStatus from "http-status";
import cookieParser from 'cookie-parser';
const app:Application = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(cookieParser())
app.get('/',(req:Request,res:Response)=>{
    res.send({
        Message:"PH HealthCare Server"
    })
})
app.use('/api/v1',router)

app.use(globalErrorhandler)

app.use((req:Request,res:Response,next:NextFunction)=>{
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'API not found',
        error : {
          path: req.originalUrl,
          message: "Your requested path is not found"
        }
    })
})



export default app;