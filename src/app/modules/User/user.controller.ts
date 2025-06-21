import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendresponse";
import httpStatus from "http-status"
import { get } from "http";
import pick from "../../../shared/pick";
import { userFilterableFoelds } from "./user.constant";
const createAdmin = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const result = await userService.createAdmin(req);
    res.status(200).json({
        success:true,
        message: "Admin created successfully",
        data: result
    })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error)?.name || "Something went wrong",
        error: error
      })  
    }
}
const createDoctor = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const result = await userService.createDoctor(req);
    res.status(200).json({
        success:true,
        message: "Doctor created successfully",
        data: result
    })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error)?.name || "Something went wrong",
        error: error
      })  
    }
}
const createPatient = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const result = await userService.createPatient(req);
    res.status(200).json({
        success:true,
        message: "patient created successfully",
        data: result
    })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error)?.name || "Something went wrong",
        error: error
      })  
    }
}
const getPatients = catchAsync(async(req:Request,res:Response)=>{
  const result = await userService.getUsers(req)
  sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message:"User data retrieved Successfully",
    data: result
  })
})
const getAllFromDB= catchAsync(async(req,res)=>{  
    const filters = pick(req.query,userFilterableFoelds)
    const options = pick(req.query,['limit','page',"sortBy","sortOrder"])
    const result = await userService.getAllFromDB(filters,options)
  sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "User data fetched successfully",
    meta: result.meta,
    data: result.data
  })
   } 
)
const changeProfileStatus = catchAsync(async(req,res)=>{
  const {id} = req.params
  const status = req.body
  const result = await userService.changeProfileStatus(id,status)
  sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "User status updated successfully",
    data: result
  })
})
export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    getPatients,
    changeProfileStatus
}