import { createBlogInput, updateBlogInput } from "@medium-clone/common";
import { Context } from "hono";
import { getPrisma } from "../lib/db";
import { apiJson } from "../utils/ApiResponse";
import { Prisma } from "@prisma/client";
import { ZCreateBlog } from "../schema";
import { imagekit } from "../utils/fileUpload";

// POST: Create a blog
const postBlog = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parsed = ZCreateBlog.safeParse(body);
    if (!parsed.success) {
      c.status(411);
      return c.json(
        apiJson("Provide correct input", parsed.error.flatten(), false),
      );
    }

    const prisma = getPrisma();
    const {
      title,
      content,
      featuredImg: imageBase64,
      isPublished,
    } = parsed.data;

    if (
      imageBase64 &&
      !imageBase64.startsWith("http") &&
      !imageBase64.startsWith("data:image")
    ) {
      return c.json({ message: "Invalid profilePic format" }, 400);
    }

    const imagekitResponse = await imagekit.upload({
      file: imageBase64,
      fileName: `${c.get("user").id}-${title.trim()}-pic`,
    });

    await prisma.blog.create({
      data: {
        title,
        content,
        slug: title.split(" ").join("-").toLowerCase(),
        userId: c.get("user").id,
        isPublished,
        featuredImg: imagekitResponse.url,
      },
    });
    if (!imagekitResponse.url) {
      c.status(500);
      return c.json(
        apiJson("Something went wrong while uploading image", {}, false),
      );
    }

    c.status(201);
    return c.json(apiJson("Blog created successfully", {}, true));
  } catch (err) {
    const error = err as Error;
    c.status(500);
    return c.json(apiJson(error.message, {}, false));
  }
};

// PUT: Update a blog by ID
const updateBlog = async (c: Context) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = updateBlogInput.safeParse(body);

  if (!parsed.success) {
    c.status(400);
    return c.json(apiJson("Please provide correct fields", {}, false));
  }

  try {
    const prisma = getPrisma();
    const { title, content } = parsed.data;

    const data = await prisma.blog.update({
      where: { id },
      data: { title, content },
    });

    return c.json(apiJson("Blog updated successfully", data, true));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      c.status(404);
      return c.json(apiJson("Blog not found", {}, false));
    }

    const err = error as Error;
    console.log(err);
    c.status(500);
    return c.json(apiJson(err.message, {}, false));
  }
};

// GET: Get a single blog by ID
const getBlog = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const prisma = getPrisma();

    const blog = await prisma.blog.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        featuredImg: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            profilePic: true,
          },
        },
      },
    });

    // console.log(blog);

    if (blog === null || !blog) {
      c.status(404);
      return c.json(apiJson("Blog Not found", blog, false));
    }
    c.status(200);
    return c.json(apiJson("Blog found successfully", blog, true));
  } catch (error: any) {
    c.status(500);
    return c.json(apiJson(error.message, {}, false));
  }
};

// GET: Get all blogs

// TODO: ADD pagination <-----------

const getBulkBlogs = async (c: Context) => {
  const page = c.req.query("p");
  if (!page || page.trim() === "") {
    c.status(400);
    return c.json(apiJson("Please provide valid argument", {}, false));
  }
  const limit = 12;
  try {
    const prisma = getPrisma();
    const [posts, totalPosts] = await Promise.all([
      prisma.blog.findMany({
        where: { isPublished: true},
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * limit,
        take: limit,
        select: {
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
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              profilePic: true,
              bio: true,
            },
          },
        },
      }),
      prisma.blog.count(),
    ]);

    c.status(200);
    return c.json(
      apiJson("Blogs fetched successfully", { posts, totalPosts }, true),
    );
  } catch (error: any) {
    c.status(500);
    return c.json(apiJson(error.message, {}, false));
  }
};

// DELETE: Delete a blog by ID
const deleteBlog = async (c: Context) => {
  const id = c.req.param("id");

  if (!id || id.trim() === "") {
    c.status(400);
    return c.json(apiJson("Please provide a valid ID", {}, false));
  }

  try {
    const prisma = getPrisma();

    await prisma.blog.delete({
      where: { id },
    });

    return c.json(apiJson("Blog deleted successfully", {}, true));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      c.status(404);
      return c.json(apiJson("Blog not found", {}, false));
    }

    const err = error as Error;
    console.log(err);
    c.status(500);
    return c.json(apiJson(err.message, {}, false));
  }
};

export { postBlog, updateBlog, getBlog, getBulkBlogs, deleteBlog };
