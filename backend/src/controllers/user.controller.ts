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
    where: { username: data.username },
  });

  if (existingUser) {
    return c.json(apiJson("User already exists", {}, false), 400);
  }

  const hashedPassword = await argon.hash(data.password);
  await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
      name: String(data.name),
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
      where: { username: body.username.trim() },
    });
    if (!user) {
      c.status(404);
      return c.json(apiJson("User not found", {}, false));
    }

    const isPasswordValid = await argon.verify(user?.password, body.password);

    if (!isPasswordValid) {
      c.status(401);
      return c.json(apiJson("Password incorrect", {}, false));
    }

    const token = await sign(
      { id: user.id, name: user.name, username: user.username },
      process.env.JWT_SECRET!,
      "HS256",
    );
    setCookie(c, "token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24, // 1 day
    });

    return c.json(
      apiJson(
        "User logged in successfully",
        {
          id: user.id,
          username: user.username,
          name: user.name,
          profilePic: user.profilePic,
          bio: user.bio,
        },
        true,
      ),
    );
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

const getAuthor = async (c: Context) => {
  try {
    const username = c.req.param("username");
    const currentUser = c.get("user");

    // Validate current user
    if (!currentUser || !currentUser.id?.trim()) {
      c.status(400);
      return c.json(apiJson("Invalid user ID", {}, false));
    }

    const prisma = getPrisma();
    const isSelf = currentUser.username === username;

    const blogSelect = {
      id: true,
      title: true,
      featuredImg: true,
      isPublished: true,
      slug: true,
      createdAt: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
      likes: {
        where: {
          userId: currentUser.id,
        },
        select: {
          id: true,
        },
      }
    };

    const author = await prisma.user.findUnique({
      where: { username },
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
          ...(isSelf ? {} : { where: { isPublished: true } }),
          orderBy: { createdAt: "desc" },
          select: blogSelect,
        },
      },
    });

    if (!author) {
      c.status(404);
      return c.json(apiJson("Author not found", {}, false));
    }

    const [isFollowing, isFollowedBy] = await Promise.all([
      prisma.follow.findFirst({
        where: {
          followerId: currentUser.id,
          followingId: author.id,
        },
      }),
      prisma.follow.findFirst({
        where: {
          followerId: author.id,
          followingId: currentUser.id,
        },
      }),
    ]);

    const { _count, ...user } = author;

    c.status(200);
    return c.json(
      apiJson(
        "User found successfully",
        {
          ...user,
          postCount: _count.Blogs,
          isUserFollowing: Boolean(isFollowing),
          isFollowedByAuthor: Boolean(isFollowedBy),
          followers: _count.followers,
          following: _count.following,
        },
        true,
      ),
    );
  } catch (error) {
    console.error("getAuthor error:", error);
    c.status(500);
    return c.json(apiJson("Something went wrong", {}, false));
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
  const username = c.req.param("username");
  if (username.trim() === "" || !username) {
    c.status(400);
    return c.json(apiJson("send username correctly", {}, false));
  }

  const prisma = getPrisma();

  const user = await prisma.user.findUnique({ where: { username } });

  if (user?.username === username) {
    c.status(200);
    return c.json(apiJson("username already exist", {}, false));
  }

  c.status(202);
  return c.json(apiJson("", {}, true));
};

const changePassword = async (c: Context) => {
  try {
    const { oldPassword, newPassword } = await c.req.json();

    if (oldPassword === newPassword) {
      c.status(400);
      return c.json(
        apiJson("Old passowrd and new password should different", {}, false),
      );
    }

    const prisma = getPrisma();

    const user = await prisma.user.findUnique({
      where: { username: c.get("user").username },
    });
    if (!user) {
      c.status(404);
      return c.json(apiJson("User not found", {}, false));
    }
    const isPasswordMatched = await argon.verify(oldPassword, user?.password);
    if (!isPasswordMatched) {
      c.status(401);
      return c.json(apiJson("Password incorrect", {}, false));
    }
    const hashedPassword = await argon.hash(newPassword);
    await prisma.user.update({
      where: {
        username: c.get("user").username,
      },
      data: {
        password: hashedPassword,
      },
    });
  } catch (error) {
    const err = error as Error;
    c.status(500);
    return c.json(
      apiJson(`${err.name} || ${err.message} || ${err.cause}`, {}, false),
    );
  }
};

// Problem --> Every time upload new photo to imagekit
const editProfile = async (c: Context) => {
  try {
    const body = await c.req.json();

    const { name, username, bio, profilePic } = body;

    if (!name || !username) {
      return c.json({ message: "Missing name or username" }, 400);
    }

    if (
      profilePic &&
      !profilePic.startsWith("http") &&
      !profilePic.startsWith("data:image")
    ) {
      return c.json({ message: "Invalid profilePic format" }, 400);
    }

    const imagekitResponse = await imagekit.upload({
      file: profilePic,
      fileName: `${username}-pic`,
    });

    if (!imagekitResponse.url) {
      c.status(500);
      return c.json(
        apiJson("Something went wrong while uploading image", {}, false),
      );
    }

    let user = await getPrisma().user.update({
      where: {
        id: c.get("user").id,
      },
      data: {
        name,
        username,
        bio: bio || "",
        profilePic: imagekitResponse.url,
      },
      select: {
        id: true,
        username: true,
        profilePic: true,
        name: true,
        bio: true,
      },
    });
    // console.log(user);

    return c.json(apiJson("Profile updated successfully", user, true));
  } catch (err) {
    console.error(err);
    return c.json({ message: "Internal Server Error" }, 500);
  }
};

export {
  userSignUp,
  userSignin,
  userSignOut,
  // getProfile,
  deleteProfile,
  updateProfile,
  isUsernameAvailable,
  changePassword,
  editProfile,
  getAuthor,
};
