import { z } from "zod"

export const signupInput = z.object({
    username: z.string(),
    password: z.string().min(6),
    name: z.string().optional()
})
export type SignupInput = z.infer<typeof signupInput>

const signinInput = z.object({
    username: z.string(),
    password: z.string().min(6),
    name: z.string().optional()
})
export type SigninInput = z.infer<typeof signinInput>

export const createBlogInput = z.object({
    title: z.string().min(4),
    content: z.string().min(6)
})
export type CreateBlogInput = z.infer<typeof createBlogInput>

export const updateBlogInput = z.object({
    title: z.string().min(4),
    content: z.string().min(6)
})
export type UpdateBlogInput = z.infer<typeof updateBlogInput>

export type apiResponse = {
    data: object;
    message: string;
    success: boolean;
}

// Get profile 

interface Blog {
    id: string;
    user: {
        id: string;
        username: string;
    };
    content: string;
    isPublished: boolean;
    title: string;
    createdAt: Date;
}

export interface IGetProfileResponse {
    id: string;
    name: string;
    username: string;
    profilePic: string;
    bio: string;
    followers: number;
    following: number;
    Blogs: Blog[];
    postCount: number;
}
