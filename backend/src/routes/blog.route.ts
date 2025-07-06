import { Hono } from "hono";
import {
  changePublish,
  deleteBlog,
  getBlog,
  getBulkBlogs,
  postBlog,
  updateBlog,
} from "../controllers/blog.controller";
import { userAuth } from "../middlewares/userAuth.mid";
import { createLike } from "../controllers/like.controller";

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

blogRouter.get("/bulk", getBulkBlogs);
blogRouter.post("/post", userAuth, postBlog);
blogRouter.get("/get/:id", userAuth, getBlog);
blogRouter.get("/delete/:id", userAuth, deleteBlog);
blogRouter.put("/update/:id", userAuth, updateBlog);
blogRouter.put("/change-publish", userAuth, changePublish);
blogRouter.post("/like-blog", userAuth, createLike);

export default blogRouter;
