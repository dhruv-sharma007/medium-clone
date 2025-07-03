import { signupInput } from "@medium-clone/common";
import { apiJson } from "../utils/ApiResponse";
import { getPrisma } from "../lib/db";
import { Context } from "hono";
import { sign } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";
import argon from "argon2";
import { imagekit } from "../utils/fileUpload";

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

    const hashedPassword = await argon.hash(data.password)
    await prisma.user.create({
        data: {
            username: data.username,
            password: hashedPassword,
            name: data.name,
        },
    });

    c.status(201);
    return c.json(apiJson("User created", {}, true));
};

// User Sign In
const userSignin = async (c: Context) => {
    const body = await c.req.json();
    // const parsed = .safeParse(body);
    // if (!parsed.success) {
    //     c.status(411);
    //     return c.json(apiJson("Input not correct", parsed.error.flatten(), false));
    // }

    // const data = parsed.data;

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is undefined!");
    const prisma = getPrisma();

    try {
        const user = await prisma.user.findUnique({
            where: { username: body.username },
        });
        if (!user) {
            c.status(404);
            return c.json(apiJson("User not found", {}, false));
        }

        const isPasswordValid = await argon.verify(user?.password, body.password)

        if (!isPasswordValid) {
            c.status(401)
            return c.json(apiJson('Password incorrect', {}, false))
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

        return c.json(apiJson("User logged in successfully", {
            id: user.id,
            username: user.username,
            name: user.name,
            profilePic: user.profilePic,
            bio: user.bio
        }, true));

    } catch (error) {
        console.log(error);

        const err = error as Error;
        c.status(500);
        return c.json(apiJson(err.message, {}, false));
    }
};

const userSignOut = async (c: Context) => {
    deleteCookie(c, "token");
    return c.json(apiJson("User logged out successfully!", {}, true));
};

// Get Profile -- discontinued
const getProfile = async (c: Context) => {
    try {
        const use = c.get("user");
        const prisma = getPrisma();

        const data = await prisma.user.findUnique({
            where: { id: use.id },
            select: {
                id: true,
                name: true,
                username: true,
                profilePic: true,
                bio: true,
                _count: {
                    select: {
                        Blogs: true,
                        followers: true,
                        following: true
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
        if (!data) {
            c.status(404);
            return c.json(apiJson("User not found", {}, false));
        }

        const { _count, ...user } = data!;

        c.status(200);
        return c.json(apiJson("User found successfully", {
            ...user,
            postCount: _count.Blogs,
            followersCount: _count.followers, // added two things
            followingCount: _count.following
        },
            true
        ));

    } catch (error) {
        const err = error as Error;
        c.status(500);
        return c.json(apiJson(err.message, {}, false));
    }
};

const getAuthor = async (c: Context) => {
    try {
        const authorId = c.req.param('id')
        const currentUser = c.get("user");

        if (currentUser.id.trim() === "" || !currentUser) {
            c.status(400)
            return c.json(apiJson('incorrect user id', {}, false))
        }

        const prisma = getPrisma();

        const [author, isFollowing, isFollowedBy] = await Promise.all([
            prisma.user.findUnique({
                where: { id: authorId },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    profilePic: true,
                    bio: true,
                    _count: {
                        select: {
                            Blogs: true,
                            followers: true,
                            following: true,
                        },
                    },
                    Blogs: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        select: {
                            id: true,
                            user: true,
                            content: true,
                            isPublished: true,
                            title: true,
                            createdAt: true,
                        },
                    },
                },
            }),

            prisma.follow.findFirst({
                where: {
                    followerId: currentUser.id,
                    followingId: authorId,
                },
            }),

            prisma.follow.findFirst({
                where: {
                    followerId: authorId,
                    followingId: currentUser.id,
                },
            }),
        ]);


        const { _count, ...user } = author!;

        c.status(200);
        return c.json(apiJson("User found successfully", {
            ...user,
            postCount: _count.Blogs,
            isFollowedByAuthor: !!isFollowedBy,
            isUserFollowing: !!isFollowing,
            followers: _count.followers,
            following: _count.following
        }, true));  

    } catch (error) {
        const err = error as Error;
        c.status(500);
        console.log(error);
        return c.json(apiJson(err.message, {}, false));
    }
}

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

const changePassword = async (c: Context) => {
    try {
        const { oldPassword, newPassword } = await c.req.json()

        if (oldPassword === newPassword) {
            c.status(400)
            return c.json(apiJson('Old passowrd and new password should different', {}, false))
        }

        const prisma = getPrisma()

        const user = await prisma.user.findUnique({ where: { username: c.get("user").username } })
        if (!user) {
            c.status(404)
            return c.json(apiJson('User not found', {}, false))
        }
        const isPasswordMatched = await argon.verify(oldPassword, user?.password)
        if (!isPasswordMatched) {
            c.status(401)
            return c.json(apiJson('Password incorrect', {}, false))
        }
        const hashedPassword = await argon.hash(newPassword)
        await prisma.user.update({
            where: {
                username: c.get("user").username
            },
            data: {
                password: hashedPassword
            }
        })
    } catch (error) {
        const err = error as Error
        c.status(500)
        return c.json(apiJson(`${err.name} || ${err.message} || ${err.cause}`, {}, false))
    }
}

// Problem --> Every time upload new photo to imagekit
const editProfile = async (c: Context) => {
    try {
        const body = await c.req.json()

        const { name, username, bio, profilePic } = body

        if (!name || !username) {
            return c.json({ message: "Missing name or username" }, 400)
        }

        if (profilePic && !profilePic.startsWith("http") && !profilePic.startsWith("data:image")) {
            return c.json({ message: "Invalid profilePic format" }, 400)
        }

        const imagekitResponse = await imagekit.upload({
            file: profilePic,
            fileName: `${username}-pic`
        })

        if (!imagekitResponse.url) {
            c.status(500)
            return c.json(apiJson('Something went wrong while uploading image', {}, false))
        }

        let user = await getPrisma().user.update({
            where: {
                id: c.get('user').id
            }, data: {
                name,
                username,
                bio: bio || "",
                profilePic: imagekitResponse.url
            },
            select: {
                id: true,
                username: true,
                profilePic: true,
                name: true,
                bio: true
            }
        });
        // console.log(user);


        return c.json(apiJson("Profile updated successfully", user, true));

    } catch (err) {
        console.error(err)
        return c.json({ message: "Internal Server Error" }, 500)
    }
}

export {
    userSignUp,
    userSignin,
    userSignOut,
    getProfile,
    deleteProfile,
    updateProfile,
    isUsernameAvailable,
    changePassword,
    editProfile,
    getAuthor
};
