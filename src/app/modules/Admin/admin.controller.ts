import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { AdminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendresponse";
import httpStatus from "http-status";

const getAllFromDB= async(req:Request,res:Response,next:NextFunction)=>{  
   try {
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
   } catch (error) {
    next(error)
   }
}
const getSingleAdmin = async (req:Request,res:Response,next:NextFunction) =>{
  try {
    const id = req.params.id
    const result = await adminServices.getSingleAdmin(id)
    sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "Admin data fetched successfully",
    data: result
  })
  } catch (error) {
    next(error)
  }
}

const updateAdmin = async(req:Request,res:Response,next:NextFunction) =>{
    try {
        const id = req.params.id
        const data = req.body
        const result = await adminServices.updateAdmin(id,data)
        sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "Admin data updated successfully",
    data: result
  })
    } catch (error) {
        next(error)
    }
}
const deleteAdmin = async(req:Request,res:Response,next:NextFunction) =>{
  try {
    const id = req.params.id
    const result = await adminServices.deleteAdmin(id)
    sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "Admin data deleted successfully",
    data: result
  })
  } catch (error) {
    next(error)
  }
}
const softDeleteAdmin = async(req:Request,res:Response,next:NextFunction) =>{
  try {
    const id = req.params.id
    const result = await adminServices.softDeleteAdmin(id)
    sendResponse(res,{
    statusCode: httpStatus.OK,
    success:true,
    message: "Admin data soft deleted successfully",
    data: result
  })
  } catch (error) {
    next(error)
  }
}
export const AdminController = {
    getAllFromDB,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin
}