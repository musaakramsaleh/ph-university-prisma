import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../../shared/sendresponse";
import httpStatus from "http-status"

const loginUser = catchAsync(async (req:Request,res:Response)=> {
  const result = await authServices.loginUser(req.body)
  const {refreshToken} = result;
  res.cookie("refreshToken",refreshToken,{
    httpOnly: true,
    secure: false,
  })
  sendResponse(res, {
    statusCode:httpStatus.OK,
    success:true,
    message:"User logged in successfully",
    data: {
      accessToken: result.accessToken,
      needsPasswordChange: result.needPasswordChange
    }
  })
})

const refreshToken = catchAsync(async (req:Request,res:Response)=>{
  const {refreshToken} = req.cookies
   const result = await authServices.refreshToken(refreshToken)

   sendResponse(res, {
    statusCode:httpStatus.OK,
    success:true,
    message: "Token refreshed successfully",
    data: result
   })
})

export const authController = {
    loginUser,
    refreshToken,
}