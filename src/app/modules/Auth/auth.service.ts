import { prisma } from "../../../shared/prisma"
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken"
import { generateToken, verifyToken } from "../../../helpers/jwtHelper";
import { UserStatus } from "../../../generated/prisma";
import config from "../../../config";

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
  },config.jwt.jwt_secret as jwt.Secret,config.jwt.expires_in)

   const refreshToken = generateToken({
    email:userData.email,
    role:userData.role
  },config.jwt.refresh_token_secret as jwt.Secret,config.jwt.refresh_token_expires_in)

   return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needsPasswordChange
   }
}

const refreshToken = async(payload:string) => {
  let decodedData;
  try {
    decodedData = verifyToken(payload,config.jwt.refresh_token_secret as jwt.Secret) as {email:string, role:string};
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
  },config.jwt.refresh_token_secret as jwt.Secret,config.jwt.refresh_token_expires_in)
  return {
    accessToken,
    needsPasswordChange: isUserExist?.needsPasswordChange
  }
}
const changePassword = async (user:any,payload:any)=>{
  console.log(user);
  console.log(payload);
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE
    }

  })
 const isCorrectPassword:boolean = await bcrypt.compare(payload.oldPassword,userData.password)
 console.log(payload);
 if(!isCorrectPassword){
    throw new Error("Password is incorrect")
  }
  const hashedPassword:string = await bcrypt.hash(payload.newPassword,12)
  await prisma.user.update({
    where: {
      email: userData.email
    },
    data: {
      password: hashedPassword,
      needsPasswordChange: false
    }
  })
  return {
    message: "Password changed successfully"
  }
}
export const authServices = {
    loginUser,
    refreshToken,
    changePassword
  }