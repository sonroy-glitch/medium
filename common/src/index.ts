import { z } from "zod";
export const signupSchema= z.object({
    name:z.string().min(1),
    email:z.string().email(),
    password:z.string().min(8).max(16)
})
export type typeSignup = z.infer<typeof signupSchema>

export const signinSchema=z.object({
    email:z.string().email(),
    password:z.string().min(8).max(16)
})
export type typeSignin = z.infer<typeof signinSchema>

export const postSchema=z.object({
     title:z.string().min(1),
     description:z.string().min(1)
})
export type typePost = z.infer<typeof postSchema>

export const updateSchema=z.object({
    id:z.number(),
    title:z.string().min(1).optional(),
    description:z.string().min(1).optional()
})
export type typeUpdate = z.infer<typeof updateSchema>