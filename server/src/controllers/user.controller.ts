import { signupInput } from "@medium-clone/common";
import { apiJson } from "../utils/ApiResponse";
import { getPrisma } from "../lib/db";
import { Context } from "hono";
import { sign } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";

const userSignUp = async (c: Context) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json(apiJson("Input not correct", {}, false));
    }
    if (!c.env.JWT_SECRET) throw new Error("JWT_SECRET is undefined!");

    const prisma = getPrisma(c.env.DATABASE_URL)

    const existingUser = await prisma.user.findUnique({
        where: {
            username:
                body.username
        }
    });
    
    if (existingUser?.username === body.username) {
        return c.json(apiJson('User already exists', {}, false), 400)
    }
    await prisma.user.create({
        data: {
            username: body.username,
            password: body.password,
            name: body.name,
        },
    });
    c.status(201);
    return c.json(apiJson('user created', {}, true))
}

const userSignin = async (c: Context) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json(apiJson("Input not correct", {}, false));
    }
    if (!c.env.JWT_SECRET) throw new Error("JWT_SECRET is undefined!");

    const prisma = getPrisma(c.env.DATABASE_URL)

    try {
        console.log("body", body);
        const user = await prisma.user.findUnique({
            where: { username: body.username, password: body.password },
            select: { id: true, name: true, username: true },
        });
        if (!user) {
            c.status(404);
            return c.json(apiJson("User not found", {}, false));
        }

        const token = await sign({ id: user.id }, c.env.JWT_SECRET, "HS256");
        setCookie(c, "token", "", { path: "/", maxAge: 0 });
        setCookie(c, "token", token, {
            path: "/",
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24,
        });
        return c.json(apiJson("User logged in successfully", {}, false));
    } catch (error) {
        const err = error as Error;
        c.status(500);
        return c.json(apiJson(err.message, {}, false));
    }
}

const userSignOut = async (c: Context) => {
    deleteCookie(c, "token");
    return c.json({ message: "User logged out successfully!", data: {}, success: true });
}

const getProfile = async (c: Context) => {
    try {
        const user = c.get('user')
        const prisma = getPrisma(c.env.DATABASE_URL)
        const data = await prisma.user.findUnique({
            where: {
                username: user.username, id: user.id
            },
            select: {
                username: true,
                name: true,
                id: true,
                Blogs: {
                    select: {
                        id: true,
                        author: true,
                        content: true,
                        published: true,
                        title: true
                    }
                }
            }
        })
        c.status(200)
        return c.json(apiJson('User found successfully', {}, false))
    } catch (error) {
        
        console.log(error)
        const err = error as Error;
        c.status(500);
        return c.json({ message: err.message, data: {}, success: false });
    }
}

export {
    userSignUp,
    userSignin,
    userSignOut,
    getProfile,
}