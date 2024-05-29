"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchema = exports.postSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(16)
});
exports.signinSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(16)
});
exports.postSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1)
});
exports.updateSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().min(1).optional()
});
