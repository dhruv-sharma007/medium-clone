import { Context } from "hono";
import { getPrisma } from "../lib/db";
import { apiJson } from "../utils/ApiResponse";

const createFollow = async (c: Context) => {
  try {
    const { id: followerId } = c.get("user");
    const followingId = c.req.param("authorId");

    await getPrisma().follow.create({
      data: {
        followerId,
        followingId,
      },
    });
    c.status(200);
    return c.json(apiJson("Successfully followed", {}, true));
  } catch (error) {
    console.log(error);

    const err = error as Error;
    c.json(apiJson(`${err.name} |${err.message} | ${err.cause}`, {}, false));

    return c.status(500);
  }
};

const deleteFollow = async (c: Context) => {
  try {
    const { id: followerId } = c.get("user");
    const followingId = c.req.param("authorId");

    await getPrisma().follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    c.status(200);
    return c.json(apiJson("Successfully unFollowed", {}, true));
  } catch (error) {
    const err = error as Error;
    console.log(err);

    c.status(500);
    return c.json(
      apiJson(`${err.name} |${err.message} | ${err.cause}`, {}, false),
    );
  }
};

export { createFollow, deleteFollow };
