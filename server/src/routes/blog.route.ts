import { Context, Hono } from "hono";
import { getCookie } from "hono/cookie";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@medium-clone/common";

type Variables = {
  user: { id: number; name: string; username: string };
};

const blogRouter = new Hono<{
  Bindings: {
    JWT_SECRET: string;
    DATABASE_URL: string;
  };
  Variables: Variables;
}>();

blogRouter.use("/*", async (c, next) => {
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

blogRouter.post("/post", async (c) => {
  try {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ message: "Input not correct" });
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    await prisma.blog.create({
      data: {
        content: body.content,
        title: body.title,
        authorId: c.get("user").id,
      },
    });
    c.status(201);
    return c.json({
      message: "blog created successfully",
      data: {},
      success: true,
    });
  } catch (err) {
    const error = err as Error;
    c.status(500);
    return c.json({ message: error.message, data: {}, success: true });
  }
});

blogRouter.put("/update", async (c) => {
  try {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ message: "Input not correct" });
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    prisma.blog.update({
      where: { id: body.id },
      data: { title: body.title, content: body.content },
    });

    c.status(200);
    return c.json({
      message: "Blog updated successfully",
      data: {},
      success: true,
    });
  } catch (error: any) {
    c.status(500);
    return c.json({ message: error.message, data: {}, success: false });
  }
});

blogRouter.get("/get/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        author: {
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
    return c.json({ data: blog, message: "Blog found successfully" });
  } catch (error: any) {
    c.status(500);
    return c.json({ message: error.message, data: {}, success: false });
  }
});

blogRouter.get("/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    c.status(200);
    return c.json({
      data: blogs,
      message: "Blogs found successfully",
      success: true,
    });
  } catch (error: any) {
    c.status(500);
    return c.json({ message: error.message, data: {}, success: false });
  }
});

export default blogRouter;
