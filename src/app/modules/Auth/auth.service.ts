import { prisma } from "../../../shared/prisma"
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken"
import { generateToken, verifyToken } from "../../../helpers/jwtHelper";
import { UserStatus } from "../../../generated/prisma";

const loginUser = async (payload:{
  email:string,
  password:string
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where:{
      email: payload.email,
      status: UserStatus.ACTIVE
    }
  });
  const isCorrectPassword:boolean = await bcrypt.compare(payload.password,userData.password)
  if(!isCorrectPassword){
    throw new Error("Password is incorrect")
  }
  const accessToken = generateToken({
    email:userData.email,
    role:userData.role
  },"sadsadfd","5min")

   const refreshToken = generateToken({
    email:userData.email,
    role:userData.role
  },"sdsdaf","15d")

   return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needsPasswordChange
   }
}

const refreshToken = async(payload:string) => {
  let decodedData;
  try {
    decodedData = verifyToken(payload,"sdsdaf")
  } catch (error) {
    throw new Error("You are not authorized")
  }
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where:{
      email: decodedData.email,
      status: UserStatus.ACTIVE
    }
  })
  const accessToken = generateToken({
    email:isUserExist?.email,
    role:isUserExist?.role
  },"sadsadfd","5min")
  return {
    accessToken,
    needsPasswordChange: isUserExist?.needsPasswordChange
  }
}

export const authServices = {
    loginUser,
    refreshToken
}