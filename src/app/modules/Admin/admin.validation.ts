import { z } from "zod";

export const update = z.object({
    body:z.object({
        name: z.string().optional(),
        contactNo: z.string().optional()
    })
})