import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { AdminFilterableFields } from "./admin.constant";


const getAllFromDB= async(req:Request,res:Response)=>{  
   try {
    const filters = pick(req.query,AdminFilterableFields)
    const options = pick(req.query,['limit','page'])
    console.log('options',options);

    const result = await adminServices.getAllFromDB(filters,options)
    res.status(200).json({
    status:200,
    success:true,
    message: "Admin data fetched successfully",
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

export const AdminController = {
    getAllFromDB
}