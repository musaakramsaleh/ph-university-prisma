import { UserRole } from "../../../generated/prisma"
import * as bcrypt from 'bcrypt'
import { prisma } from "../../../shared/prisma";
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
    
    // const hashedPassword:string = await bcrypt.hash(data.password,12)
    // const userData = {
    //     email : data.admin.email,
    //     password: hashedPassword,
    //     role: UserRole.ADMIN
    // }
    // const result = await prisma.$transaction(async(transactionClient)=>{
    //     const createdUserData = await transactionClient.user.create({
    //         data: userData
    //     });

    //     const createdAdminData = await transactionClient.admin.create({
    //         data: {
    //             ...data.admin,
    //             isDeleted: false // or true, depending on your logic
    //         }
    //     })
    //     return createdAdminData
    // })
    // return result
}

export const userService = {
    createAdmin
}