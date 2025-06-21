import { Prisma, UserRole } from "../../../generated/prisma"
import * as bcrypt from 'bcrypt'
import { prisma } from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { profile } from "console";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import { usersearchalefields } from "./user.constant";
import { Request } from "express";
interface AdminData {
    name: string;
    email: string;
    contactNo: string;  // Must match schema (not contactNumber)
    profilePhoto?: string;
}
interface CreateAdminInput {
    admin: AdminData;
    password: string;
}

const createAdmin = async (req: any) => {
    // console.log("file",req.file);
    // console.log("Data",req.body.data);
    const file:IFile = req.file;
    if(file){
        const uploadtoCloudinary = await uploadToCloudinary(file)
        req.body.admin.profilePhoto = uploadtoCloudinary?.secure_url
        
    } 
    const hashedPassword:string = await bcrypt.hash(req.body.password,12)
    const userData = {
        email : req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }
    const result = await prisma.$transaction(async(transactionClient)=>{
        const createdUserData = await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        })
        return createdAdminData
    })
    return result
}
const createDoctor = async (req: any) => {
    // console.log("file",req.file);
    // console.log("Data",req.body.data);
    const file:IFile = req.file;
    if(file){
        const uploadtoCloudinary = await uploadToCloudinary(file)
        req.body.doctor.profilePhoto = uploadtoCloudinary?.secure_url
        
    } 
    const hashedPassword:string = await bcrypt.hash(req.body.password,12)
    const userData = {
        email : req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }
    const result = await prisma.$transaction(async(transactionClient)=>{
        await transactionClient.user.create({
            data: userData
        });

        const createDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        })
        return createDoctorData
    })
    return result
}
const createPatient = async (req: any) => {
    // console.log("file",req.file);
    // console.log("Data",req.body.data);
    const file:IFile = req.file;
    if(file){
        const uploadtoCloudinary = await uploadToCloudinary(file)
        req.body.patient.profilePhoto = uploadtoCloudinary?.secure_url
        
    } 
    const hashedPassword:string = await bcrypt.hash(req.body.password,12)
    const userData = {
        email : req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }
    const result = await prisma.$transaction(async(transactionClient)=>{
        await transactionClient.user.create({
            data: userData
        });

        const createDoctorData = await transactionClient.patient.create({
            data: req.body.patient
        })
        return createDoctorData
    })
    return result
}
const getUsers = async(req:any)=>{
    const result = await prisma.user.findMany({
           include:{
            admin:true,
            patient:true,
            doctor:true
           }
        })
    const structuredUsers = result.map(user=>{
        let UserRole = null;
        let userData = {}
        if(user.admin){
            UserRole = 'admin';
            userData = user.admin;
        }else if(user.doctor){
            UserRole = "doctor";
            userData = user.doctor;
        }else if(user.patient){
            UserRole = "patient";
            userData = user.patient;
        }
        return {
        id:user.id,
        email:user.email,
        role:user.role,
        profile:userData,
        createdAt: user.createdAt,
        status:user.status
    }
    }) 
    return structuredUsers
}
const getAllFromDB = async(params:any,options:IPaginationOptions)=>{
    const {page,limit,skip} = calculatePagination((options as any))
    const {searchTerm,...filterData} = params
    const andConditions: Prisma.UserWhereInput[] = []
    
    if(params.searchTerm){
        andConditions.push({
            OR: usersearchalefields.map(field=>({
                [field]:{
                    contains:params.searchTerm,
                    mode:"insensitive",
                 }
            }))
        })
    }
    if(Object.keys(filterData).length>0){
        andConditions.push({
            AND: Object.keys(filterData).map(key=>({
                [key] : {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }
   
    const whereConditions:Prisma.UserWhereInput =andConditions.length > 0 ? {AND: andConditions}:{}
    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }: {
            createdAt: 'desc'
        },
        select: {
            id:true,
            email:true,
            status:true,
            role:true,
            needsPasswordChange:true,
            createdAt:true,
            updatedAt:true,
            admin:true,
            patient:true,
            doctor:true
    }
});
    const total = await prisma.user.count({
        where: whereConditions
    })
    return {
        meta :{ 
            page,
            limit,
            total
        },
        data: result
    }
}
const changeProfileStatus = async(id:string,status:UserRole)=>{
  const userdata = await prisma.user.findUniqueOrThrow({
    where:{
        id
    }
  })
  const updateUserStatus = await prisma.user.update({
    where:{
        id,
    },
    data:status
  })
  return updateUserStatus
}
export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    getUsers,
    changeProfileStatus
}