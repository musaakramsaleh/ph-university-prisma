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
const changedPassword = catchAsync(async (req:Request & {user?:any},res:Response)=>{
  const result = await authServices.changePassword(req.user,req.body)
  sendResponse(res, {
    statusCode:httpStatus.OK,
    success:true,
    message: "Password changed successfully",
    data: result
   })
}
)
const forgetPassword = catchAsync(async (req, res) => {
  const result = await authServices.forgetPaaword(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "check your email",
    data: result,
  });
})
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization || "";

  const result = await authServices.resetPassword(token,req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset!",
    data: result
  })
})
export const authController = {
    loginUser,
    refreshToken,
    changedPassword,
  forgetPassword,
    resetPassword
}