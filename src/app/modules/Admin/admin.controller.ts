import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { AdminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendresponse";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";

const getAllFromDB: RequestHandler= catchAsync(async(req,res)=>{  
    const filters = pick(req.query,AdminFilterableFields)
    const options = pick(req.query,['limit','page',"sortBy","sortOrder"])
    const result = await adminServices.getAllFromDB(filters,options)
  sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "Admin data fetched successfully",
    meta: result.meta,
    data: result.data
  })
   } 
)
const getSingleAdmin = catchAsync(async (req:Request,res:Response) =>{
    const id = req.params.id
    const result = await adminServices.getSingleAdmin(id)
    sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "Admin data fetched successfully",
    data: result
  })
  } 
)

const updateAdmin = catchAsync(async(req:Request,res:Response) =>{
        const id = req.params.id
        const data = req.body
        const result = await adminServices.updateAdmin(id,data)
        sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "Admin data updated successfully",
    data: result
  })
    } 
)
const deleteAdmin = catchAsync(async(req:Request,res:Response) =>{
    const id = req.params.id
    const result = await adminServices.deleteAdmin(id)
    sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "Admin data deleted successfully",
    data: result
  })
  })
const softDeleteAdmin = catchAsync(async(req:Request,res:Response) =>{
    const id = req.params.id
    const result = await adminServices.softDeleteAdmin(id)
    sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "Admin data soft deleted successfully",
    data: result
  })
  } 
)
export const AdminController = {
    getAllFromDB,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin
}