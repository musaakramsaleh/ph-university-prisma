import { prisma } from "../../../shared/prisma"
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken"
import { generateToken, verifyToken } from "../../../helpers/jwtHelper";
import { UserStatus } from "../../../generated/prisma";
import config from "../../../config";
import emailSender from "./emailSender";

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

const forgetPaaword = async(payload: {email:string}) => {
 const userExist = await prisma.user.findUniqueOrThrow({
  where: {
    email: payload.email,
    status: UserStatus.ACTIVE
  }
 })
  const resetPasswordToken = generateToken({ email: userExist.email, role: userExist.role }, config.jwt.jwt_secret as jwt.Secret, config.jwt.refresh_token_expires_in as string)
  const resetLink = config.reset_pass_link + `?email=${userExist.id}&token=${resetPasswordToken}`;
  await emailSender(
    userExist.email,
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
  <h2 style="color: #333;">Hello,</h2>
  <p style="color: #555; font-size: 16px;">
    You recently <b>Sifat valo hoye jao</b> requested to reset your password. Click the button below to proceed:
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 14px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
      Reset Password
    </a>
  </div>

  <p style="color: #999; font-size: 14px;">
    If you did not request a password reset, you can safely ignore this email.
  </p>

  <p style="color: #333; font-size: 14px; margin-top: 40px;">Thanks,<br>The Support Team</p>
</div>

    `
  );
  return {
     reset_Link: resetLink
   }
}
const resetPassword = async(token:string,payload:{id:string,password:string}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status:UserStatus.ACTIVE
    }
  })
  // const isValidToken = verifyToken(token, config.jwt.refresh_token_secret as jwt.Secret)
  // console.log(isValidToken)
  const hashedPassword: string = await bcrypt.hash(payload.password, 12)
  await prisma.user.update({
    where: {
     id: userData.id,
    },
    data: {
      password: hashedPassword,
      needsPasswordChange: false
    }
  })
  return {
    messsage: "Password changed successfully"
  }
}
export const authServices = {
    loginUser,
    refreshToken,
    changePassword,
  forgetPaaword,
    resetPassword
  }