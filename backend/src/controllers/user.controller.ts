import { signupInput } from "@medium-clone/common";
import { apiJson } from "../utils/ApiResponse";
import { getPrisma } from "../lib/db";
import { Context } from "hono";
import { sign } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";
import { ProfilePicUrl } from '../../../client/src/lib/static';

// User Sign Up
const userSignUp = async (c: Context) => {
    const body = await c.req.json();
    const parsed = signupInput.safeParse(body);
    if (!parsed.success) {
        c.status(411);
        return c.json(apiJson("Input not correct", parsed.error.flatten(), false));
    }

    const data = parsed.data;

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is undefined!");
    const prisma = getPrisma();

    const existingUser = await prisma.user.findUnique({
        where: { username: data.username }
    });

    if (existingUser) {
        return c.json(apiJson("User already exists", {}, false), 400);
    }

    await prisma.user.create({
        data: {
            username: data.username,
            password: data.password,
            name: data.name,
        },
    });

    c.status(201);
    return c.json(apiJson("User created", {}, true));
};

// User Sign In
const userSignin = async (c: Context) => {
    const body = await c.req.json();
    const parsed = signupInput.safeParse(body);
    if (!parsed.success) {
        c.status(411);
        return c.json(apiJson("Input not correct", parsed.error.flatten(), false));
    }

    const data = parsed.data;

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is undefined!");
    const prisma = getPrisma();

    try {
        const user = await prisma.user.findUnique({
            where: { username: data.username, password: data.password },
            select: { id: true, name: true, username: true },
        });

        if (!user) {
            c.status(404);
            return c.json(apiJson("User not found", {}, false));
        }

        const token = await sign(
            { id: user.id, name: user.name, username: user.username },
            process.env.JWT_SECRET!,
            "HS256"
        );
        setCookie(c, "token", token, {
            path: "/",
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24, // 1 day
        });

        return c.json(apiJson("User logged in successfully", user, true));
    } catch (error) {
        const err = error as Error;
        c.status(500);
        return c.json(apiJson(err.message, {}, false));
    }
};

// User Sign Out
const userSignOut = async (c: Context) => {
    deleteCookie(c, "token");
    return c.json(apiJson("User logged out successfully!", {}, true));
};

// Get Profile
const getProfile = async (c: Context) => {
    try {
        const use = c.get("user");
        const prisma = getPrisma();

        const data = await prisma.user.findUnique({
            where: { id: use.id, username: use.username },
            select: {
                id: true,
                name: true,
                username: true,
                followers: true,
                following: true,
                profilePic: true,
                bio: true,
                _count: {
                    select: {
                        Blogs: true
                    }
                },
                Blogs: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: {
                        id: true,
                        user: true,
                        content: true,
                        isPublished: true,
                        title: true,
                        createdAt: true
                    },
                },
            },
        });

        const { _count, ...user } = data!;

        c.status(200);
        return c.json(apiJson("User found successfully", {
            ...user,
            postCount: _count.Blogs,
        }, true));
    } catch (error) {
        const err = error as Error;
        c.status(500);
        return c.json(apiJson(err.message, {}, false));
    }
};

// Delete Profile
const deleteProfile = async (c: Context) => {
    const user = c.get("user");
    const prisma = getPrisma();

    await prisma.user.delete({ where: { id: user.id } });

    c.status(200);
    return c.json(apiJson("User deleted successfully", {}, true));
};

// Update Profile (to be implemented)
const updateProfile = async (c: Context) => {
    return c.json(apiJson("Update profile not implemented yet", {}, false));
};

const isUsernameAvailable = async (c: Context) => {
    const username = c.req.param('username')
    if (username.trim() === "" || !username) {
        c.status(400)
        return c.json(apiJson('send username correctly', {}, false))
    }

    const prisma = getPrisma()

    const user = await prisma.user.findUnique({ where: { username } })

    if (user?.username === username) {
        c.status(200)
        return c.json(apiJson('username already exist', {}, false))
    }

    c.status(202)
    return c.json(apiJson('', {}, true))
}

const editProfile = () => {
    
}

export {
    userSignUp,
    userSignin,
    userSignOut,
    getProfile,
    deleteProfile,
    updateProfile,
    isUsernameAvailable
};
