import { UserRole } from "../../../generated/prisma"
import * as bcrypt from 'bcrypt'
import { prisma } from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
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

export const userService = {
    createAdmin,
    createDoctor,
    createPatient
}