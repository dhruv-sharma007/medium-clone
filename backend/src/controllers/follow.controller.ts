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

const getFollowersAndFollowing = async (c: Context) => {
  const { id } = c.req.param();
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "50");

  if (!id) {
    c.status(400);
    return c.json(apiJson("User ID is required", {}, false));
  }

  try {

    const [following, followers] = await Promise.all([
      getPrisma().follow.findMany({
        where: {
          followerId: id,
        },
        skip: (page - 1) * limit,
        take: limit,

        include: {
          following: {
            select: {
              id: true,
              username: true,
              name: true,
              profilePic: true,
            },
          },
        },
      }),
      getPrisma().follow.findMany({
        where: {
          followingId: id,
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              name: true,
              profilePic: true,
            },
          },
        },
      })
    ])

    const followersData = followers.map((f) => f.follower);
    const followingData = following.map((f) => f.following);

    return c.json(
      apiJson(
        "Followers fetched successfully",
        {
          followersData,
          followingData
        },
        true,
      ),
    );
  } catch (err) {
    console.error("Error fetching followers:", err);
    c.status(500);
    return c.json(apiJson("Failed to fetch followers", {}, false));
  }
};
export { createFollow, deleteFollow, getFollowersAndFollowing };
