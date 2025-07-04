import { z } from 'zod'

export const ZCreateBlog = z.object({
    title: z.string().min(3),
    content: z.string().min(5),
    featuredImg: z.string().refine((value) => {
        return /^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(value);
    }, {
        message: "Invalid base64 image format",
    }),
    isPublished: z.boolean(),
}) 