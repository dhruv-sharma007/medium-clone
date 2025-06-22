import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import { signupInput, signinInput } from "@medium-clone/common";
import { getPrisma } from "../lib/db";

type Variables = {
  user: { id: number; name: string; username: string };
};

const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: Variables;
}>();

user.use("/protected/*", async (c, next) => {
  const token = getCookie(c, "token");
  const isVerified: any = await verify(
    String(token),
    String(c.env.JWT_SECRET),
    "HS256",
  );

  if (typeof isVerified === "object" && isVerified !== null) {
    c.set("user", {
      id: isVerified.id,
      name: isVerified.name,
      username: isVerified.username,
    });
  } else {
    return c.json({ message: "Unauthorized" }, 401);
  }

  return await next();
});

user.post("/signup", async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Input not correct" });
  }
  if (!c.env.JWT_SECRET) throw new Error("JWT_SECRET is undefined!");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const res = await prisma.user.create({
    data: {
      username: body.username,
      password: body.password,
      name: body.name,
    },
  });
  c.status(201);
  return c.json({ message: "user created", statusCode: 201 });
});

user.get("/protected/signout", async (c) => {
  deleteCookie(c, "token");
  return c.json({ message: "User logged out successfully!", data: {}, success: true });
});

user.post("/signin", async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Input not correct" });
  }
  if (!c.env.JWT_SECRET) throw new Error("JWT_SECRET is undefined!");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    console.log("body", body);
    const user = await prisma.user.findUnique({
      where: { username: body.username, password: body.password },
      select: { id: true, name: true, username: true },
    });

    if (!user) {
      c.status(404);
      return c.json({ message: "User not found", data: {}, status: false });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET, "HS256");
    setCookie(c, "token", "", { path: "/", maxAge: 0 });
    setCookie(c, "token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24,
    });
    return c.json({ message: "User logged in successfully", data: user });
  } catch (error) {
    const err = error as Error;
    c.status(500);
    return c.json({ message: err.message });
  }
});

user.get('/protected/me', async (c) => {
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
    return c.json({ message: "User found successfully", data: data, success: true })

  } catch (error) {
    console.log(error)
    const err = error as Error;
    c.status(500);
    return c.json({ message: err.message, data: {}, success: false });
  }
})

export default user;
