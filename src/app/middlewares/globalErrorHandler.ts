import { Request, Response, NextFunction } from 'express';
import httpStatus from "http-status";
const globalErrorhandler = (err:any,req:Request,res:Response,next:NextFunction)=>{
   res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
         success: false,
         message: (err as Error)?.message || "Something went wrong",
         error: err
   })
}
   export default globalErrorhandler