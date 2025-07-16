import { Context } from "hono";
import { getPrisma } from "../lib/db";
import { apiJson } from "../utils/ApiResponse";

const createLike = async (c: Context) => {
  try {
    const { userId, postId } = await c.req.json();

    if (!userId?.trim() || !postId?.trim()) {
      c.status(400);
      return c.json(apiJson("incorrect parameters", {}, false));
    }

    const like = await getPrisma().like.create({
      data: {
        userId: userId,
        blogId: postId,
      },
    });

    c.status(201);
    return c.json(apiJson("Like created", like, true));
  } catch (err) {
    const error = err as Error;
    c.status(500);
    return c.json(apiJson(error.message, {}, false));
  }
};

const deleteLike = async (c: Context) => {
  try {
    const { likeId } = await c.req.json();

    if (!likeId?.trim()) {
      c.status(400);
      return c.json(apiJson("incorrect parameters", {}, false));
    }

    const deleted = await getPrisma().like.delete({
      where: {
        id: likeId,
      },
    });

    c.status(200);
    return c.json(apiJson("Like deleted", deleted, true));
  } catch (err) {
    const error = err as Error;
    c.status(500);
    return c.json(apiJson(error.message, {}, false));
  }
};

export { createLike, deleteLike };
