import * as jwt from "jsonwebtoken"
import httpStatus from "http-status";
import { NextFunction, Request, Response } from 'express';
import { verifyToken } from "../../helpers/jwtHelper";
import config from "../../config";
import ApiError from "../errors/ApiErrors";
export const auth = (...roles: string[]) => {
 return async (req: Request, res: Response, next: NextFunction) => {
   try{
    const token = req.headers.authorization;
    if(!token){
        throw new ApiError(httpStatus.UNAUTHORIZED,"You are not authorized")
    }
    const verifiedUser = verifyToken(token,config.jwt.jwt_secret as jwt.Secret)
    req.user = verifiedUser;
    if(roles.length && !roles.includes(verifiedUser.role)){
        throw new ApiError(httpStatus.FORBIDDEN,"You are not authorized")
    }
    next()
   }catch(error){
    next(error)
   }
 }
}