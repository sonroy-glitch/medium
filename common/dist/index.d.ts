import { z } from "zod";
export declare const signupSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export type typeSignup = z.infer<typeof signupSchema>;
export declare const signinSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type typeSignin = z.infer<typeof signinSchema>;
export declare const postSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
}, {
    title: string;
    description: string;
}>;
export type typePost = z.infer<typeof postSchema>;
export declare const updateSchema: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    title?: string | undefined;
    description?: string | undefined;
}, {
    id: number;
    title?: string | undefined;
    description?: string | undefined;
}>;
export type typeUpdate = z.infer<typeof updateSchema>;
