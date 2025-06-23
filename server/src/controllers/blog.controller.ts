import { createBlogInput, updateBlogInput } from "@medium-clone/common";
import { Context } from "hono";
import { getPrisma } from "../lib/db";
import { apiJson } from "../utils/ApiResponse";
import { Prisma } from "@prisma/client";

const postBlog = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { success } = createBlogInput.safeParse(body);
        if (!success) {
            c.status(411);
            return c.json(apiJson('Provide correct input', {}, false));
        }
        const prisma = getPrisma(c.env.DATABASE_URL)

        await prisma.blog.create({
            data: {
                content: body.content,
                title: body.title,
                slug: body.title.split(' ').join('-'),
                userId: c.get("user").id,
            },
        });
        c.status(201);
        return c.json(apiJson('blog created successfully', {}, true));
    } catch (err) {
        const error = err as Error;
        c.status(500);
        return c.json(apiJson(error.message, {}, false));
    }
}

const updateBlog = async (c: Context) => {
    const body = await c.req.json();
    const res = updateBlogInput.safeParse(body);
    const id = c.req.param("id")

    if (!res.success) {
        c.status(400)
        return c.json({
            message: "please provide correct fields",
            data: {},
            success: false,
        })
    }
    try {
        const prisma = getPrisma(c.env.DATABASE_URL);

        const data = await prisma.blog.update({
            where: {
                id: id
            }, data: {
                content: res.data.content,
                title: res.data.title
            }
        })

        return c.json({
            message: "Blog updated successfully",
            data,
            success: true,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                c.status(404);
                return c.json({
                    message: error.message,
                    data: {},
                    success: false,
                });
            }
        }
        const err = error as Error
        console.log(err)
        c.status(500);
        return c.json({
            message: err.message,
            data: {},
            success: false,
        });
    }
}

const getBlog = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const prisma = getPrisma(c.env.DATABASE_URL)

        const blog = await prisma.blog.findUnique({
            where: {
                id: id,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
                },
                content: true,
                id: true,
                title: true,
            },
        });

        c.status(200);
        return c.json(apiJson('Blog found successfully', blog, true));

    } catch (error: any) {
        c.status(500);
        return c.json(apiJson(error.message, {}, false));
    }
}

const getBulkBlogs = async (c: Context) => {
    try {
        const prisma = getPrisma(c.env.DATABASE_URL)

        const blogs = await prisma.blog.findMany({
            orderBy: {
                id: 'desc'
            },
            select: {
                id: true,
                title: true,
                content: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
                },
            },
        });
        if (!blogs) {
            c.status(200);
            return c.json(apiJson('Blogs not found', {}, false));
        }

        c.status(200);
        return c.json(apiJson('Blogs found successfully', blogs, true));
    } catch (error: any) {
        c.status(500);
        return c.json(apiJson(error.message, {}, false));
    }
}

const deleteBlog = async (c: Context) => {
    const id = c.req.param("id");

    if (!id || id.trim() === "") {
        c.status(400);
        return c.json(apiJson('Please provide valid id', {}, false));
    }

    try {
        const prisma = getPrisma(c.env.DATABASE_URL);

        await prisma.blog.delete({
            where: { id: id },
        });

        return c.json(apiJson('Blogs deleted successfully', {}, false));
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {

                c.status(404);
                return c.json(apiJson(error.message, {}, false));
            }
        }
        const err = error as Error
        console.log(err)
        c.status(500);
        return c.json(apiJson(err.message, {}, false));
    }
}

export {
    postBlog,
    updateBlog,
    getBlog,
    getBulkBlogs,
    deleteBlog
}
