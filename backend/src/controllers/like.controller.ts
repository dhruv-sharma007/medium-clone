import { Context } from "hono";
import { getPrisma } from "../lib/db";
import { apiJson } from "../utils/ApiResponse";

const createLike = async (c: Context) => {
    try {
        const { userId, postId } = await c.req.json()

        if (userId.trim() === "" || !userId || postId.trim() === '' || !postId) {
            c.status(400)
            return c.json(apiJson('incorrect parameters', {}, false))
        }

        await getPrisma().like.create({
            data: {
                userId: userId,
                blogId: postId
            }
        })

    } catch (err) {
        const error = err as Error;
        c.status(500);
        return c.json(apiJson(error.message, {}, false));
    }
}

export {
    createLike
}