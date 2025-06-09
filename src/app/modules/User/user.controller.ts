import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req:Request,res:Response) => {
    console.log(req.file);
    console.log(req.body.data);
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

export const userController = {
    createAdmin
}