import { Admin, Prisma, PrismaClient } from "../../../generated/prisma";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { prisma } from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { adminSearchableFields } from "./admin.constant";
import { IAdminFilterRequest } from "./admin.interface";



const getAllFromDB = async(params:IAdminFilterRequest,options:IPaginationOptions)=>{
    const {page,limit,skip} = calculatePagination((options as any))
    const {searchTerm,...filterData} = params
    const andConditions: Prisma.AdminWhereInput[] = []
    
    if(params.searchTerm){
        andConditions.push({
            OR: adminSearchableFields.map(field=>({
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
    andConditions.push({
        isDeleted: false
    })
    const whereConditions:Prisma.AdminWhereInput = {AND: andConditions}
    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }: {
            createdAt: 'desc'
        }
    });
    const total = await prisma.admin.count({
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
const getSingleAdmin = async(id: string) :Promise<Admin| null> => {
    const result = await prisma.admin.findUnique({
        where: { id , isDeleted: false }
    });
    return result;
}

const updateAdmin = async(id:string,data:Partial<Admin>):Promise<Admin> => {
    await prisma.admin.findUniqueOrThrow({
        where :{
            id,
            isDeleted: false
        }
    })
  const result = await prisma.admin.update({
    where :{
        id
    },
    data
  })
  return result;
}

const deleteAdmin = async(id:string):Promise<Admin>=> {
    await prisma.admin.findUniqueOrThrow({
        where:{
            id
        }
    })
    const result = await prisma.$transaction(async(transactionClient)=>{
          const adminDeleteddata = await transactionClient.admin.delete({
            where:{id}
          })
         await transactionClient.user.delete({
            where :{
                email:adminDeleteddata.email
            }
          })
          return adminDeleteddata
    })
    return result
}
const softDeleteAdmin = async(id:string)=> {
    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted: false
        }
    })
    const result = await prisma.$transaction(async(transactionClient)=>{
          const adminDeleteddata = await transactionClient.admin.update({
            where: { id },
            data: { isDeleted: true }
          })
          const userdeleted = await transactionClient.user.update ({
            where :{
                email:adminDeleteddata.email
            },
            data:{
                status:"BLOCKED"
            }
          })
          return adminDeleteddata
    })
    return result
}
export const adminServices = {
    getAllFromDB,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin
}