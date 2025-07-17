import { Context } from "hono";
import { getPrisma } from "../lib/db";
import { ZCreateComment } from "../schema/index";
import { apiJson } from "../utils/ApiResponse";

const createComment = async (c: Context) => {
  const body = await c.req.json();
  const res = ZCreateComment.safeParse(body);

  if (!res.success) {
    c.status(400);
    res.error.flatten();
    return c.json(apiJson(res.error.message, {}, false));
  }

  try {
    const newComment = await getPrisma().comment.create({
      data: {
        content: res.data.content,
        blogid: res.data.blogid,
        userId: res.data.userId,
      },
    });
    c.status(201);
    return c.json(apiJson("Comment created successfully", newComment, true));
  } catch (err) {
    console.error("Error creating comment:", err);
    c.status(500);
    return c.json(apiJson("Failed to create comment", {}, false));
  }
};

const deleteComment = async (c: Context) => {
  const { id } = c.req.param();

  if (!id) {
    c.status(400);
    return c.json(apiJson("Comment ID is required", {}, false));
  }

  try {
    const deletedComment = await getPrisma().comment.delete({
      where: { id },
    });

    return c.json(
      apiJson("Comment deleted successfully", deletedComment, true),
    );
  } catch (err: any) {
    console.error("Error deleting comment:", err);

    if (err.code === "P2025") {
      c.status(404);
      return c.json(apiJson("Comment not found", {}, false));
    }

    c.status(500);
    return c.json(apiJson("Failed to delete comment", {}, false));
  }
};

const getComments = async (c: Context) => {
  const { blogid } = c.req.param();
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "10");

  if (!blogid) {
    c.status(400);
    return c.json(apiJson("Blog ID is required", {}, false));
  }

  try {
    const comments = await getPrisma().comment.findMany({
      where: {
        blogid: blogid,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            profilePic: true,
          },
        },
      },
    });
    // console.log(comments);

    return c.json(apiJson("Comments fetched successfully", { comments }, true));
  } catch (err) {
    console.error("Error fetching comments:", err);
    c.status(500);
    return c.json(apiJson("Failed to fetch comments", {}, false));
  }
};

export { createComment, deleteComment, getComments };
