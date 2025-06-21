import { z } from "zod";
import { Gender } from "../../../generated/prisma";
import status from "http-status";
import { error } from "console";

const createAdmin = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    admin: z.object({
        name: z.string({
            required_error:"Name is required",
        }),
        email:z.string({
            required_error:"Email is required",
        }),
        contactNo: z.string({
            required_error:"Contact number is required",
        }),
    })
})
const createDoctor = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    doctor: z.object({
        name: z.string({
            required_error:"Name is required",
        }),
        email:z.string({
            required_error:"Email is required",
        }),
        contactNo: z.string({
            required_error:"Contact number is required",
        }),
        address:z.string().optional(),
        registrationNumber: z.string({
            required_error:"Registration number is required"
        }),
        experience:z.number().optional(),
        gender:z.enum([Gender.MALE,Gender.FEMALE]),
        appointmentFee:z.number({
            required_error:"appopintment fee required"
        }),
        qualification:z.string({
            required_error:"Qualification is required",
        }),
        currentWorkingPlace:z.string({
            required_error:"Working Place is required",
        }),
        designation: z.string({
            required_error:" Designation is required",
        }),
    })
})
const createPatient = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    patient: z.object({
        name: z.string({
            required_error:"Name is required",
        }),
        email:z.string({
            required_error:"Email is required",
        }),
        contactNo: z.string({
            required_error:"Contact number is required",
        }),
        address:z.string().optional(),
        
        gender:z.enum([Gender.MALE,Gender.FEMALE]),
    })
})
const userStatus = z.object({
    status: z.enum(['ACTIVE', 'BLOCKED'])
})
export const userValidation = {
    createAdmin,
    createDoctor,
    createPatient,
    userStatus
}