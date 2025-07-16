import { Hono } from "hono";
import {
  changePublish,
  deleteBlog,
  getBlog,
  getBulkBlogs,
  postBlog,
  searchBlog,
  updateBlog,
} from "../controllers/blog.controller";
import { getBlogsMid, userAuth } from "../middlewares/userAuth.mid";
import { createLike, deleteLike } from "../controllers/like.controller";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller";

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

blogRouter.get("/bulk", getBlogsMid, getBulkBlogs);
blogRouter.post("/post", userAuth, postBlog);
blogRouter.get("/get/:id", userAuth, getBlog);
blogRouter.get("/delete/:id", userAuth, deleteBlog);
blogRouter.put("/update/:id", userAuth, updateBlog);
blogRouter.put("/change-publish", userAuth, changePublish);

blogRouter.post("/like-blog", userAuth, createLike);
blogRouter.delete("/like-blog/:id", userAuth, deleteLike);

blogRouter.post("/comment-blog", userAuth, createComment);
blogRouter.delete("/comment-blog/:id", userAuth, deleteComment);
blogRouter.get("/:blogid/comments", getComments); // GET /blogs/:blogid/comments?page=1&limit=5

blogRouter.get("/search/:searchTerm", searchBlog); // GET /blogs/:blogid/comments?page=1&limit=5
export default blogRouter;
