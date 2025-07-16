import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { RotateLoading } from "../components/Loading";
import { deleteComment, getBlog, getComments, postComment } from "../lib/api";
import { FaComment } from "react-icons/fa";
import type { IComment, IPost } from "../vite-env";
import { ProfilePicUrl } from "../lib/static";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/auth";
import { MdDelete } from "react-icons/md";

const Blog = () => {
  const { id } = useParams();
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const { user } = useAuthStore();

  const fetchComments = () => {
    if (!id) return;
    getComments(id).then((res) => {
      setComments(res.data.data.comments);
      console.log(res);
    });
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    setCommentLoading(true);
    try {
      if (id && user) {
        await postComment({
          content: commentText,
          blogid: id,
          userId: user.id,
        });
        setCommentText("");
        fetchComments();
      }
    } catch (e) {
      toast.error("Failed to post comment");
      console.log(e);
    } finally {
      setCommentLoading(false);
    }
  };

  // comment logic ends here
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<IPost>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getBlog(id)
      .then((res) => setBlog(res.data.data))
      .catch((e) => setError("Unable to load blog." + e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <RotateLoading />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!blog) return null;

  return (
    <>
      <article className="max-w-3xl mx-auto p-6 rounded-lg mt-8">
        {blog.featuredImg && (
          <img
            src={blog.featuredImg}
            alt="Featured"
            className="w-full h-full rounded-md mb-6"
          />
        )}
        <header className="mb-4">
          <h1 className="text-4xl font-bold leading-tight mb-2">
            {blog.title}
          </h1>
          <div className="flex items-center text-gray-500 text-sm">
            <Link to={`/profile/${blog.user.username}`}>
              <img
                src={blog?.user?.profilePic || ProfilePicUrl}
                alt={blog.user.name}
                className="w-14 h-14 object-cover rounded-full mr-2"
              />
            </Link>
            <span>
              By <strong>{blog.user.name}</strong> (@{blog.user.username})
            </span>
            <span className="mx-2">•</span>
            <time dateTime={blog.createdAt}>
              {format(new Date(blog.createdAt), "MMM dd, yyyy")}
            </time>
          </div>
        </header>

        <section className="prose prose-lg mb-6">
          <p className="whitespace-pre-wrap">{blog.content}</p>
        </section>

        <footer className="flex items-center justify-between text-gray-600">
          <div className="flex items-center space-x-4">
            {/* <div className="flex items-center">
            <FaHeart className="mr-1 text-red-500" />
            <span>{blog._count.likes}</span>
          </div> */}
            <div className="flex items-center">
              <FaComment className="mr-1" />
              <span>{blog._count.comments}</span>
            </div>
          </div>
          <Link to="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </Link>
        </footer>
      </article>
      {/* comment section  */}
      <section className="max-w-3xl mx-auto p-6 mt-10">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        <div className="mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border rounded mb-2"
            rows={3}
          />
          <button
            onClick={handlePostComment}
            disabled={commentLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {commentLoading ? "Posting..." : "Post Comment"}
          </button>
        </div>

        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className=" shadow bg-gray-100 rounded p-4">
                <div className="flex items-center mb-2">
                  <div className="flex justify-between w-full">
                    <div className="flex">
                      <img
                        src={c.user?.profilePic || ProfilePicUrl}
                        alt={c.user?.name}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      <div>
                        <p className="font-medium">{c.user?.name}</p>
                        <p className="text-sm text-gray-500">
                          @{c.user?.username}
                        </p>
                      </div>
                    </div>
                    {c.user.id === user?.id ? (
                      <MdDelete
                        onClick={() => handleDeleteComment(c.id)}
                        className="cursor-pointer text-2xl hover:text-red-700 active:text-red-400"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <p>{c.content}</p>
                <time className="text-xs text-gray-400">
                  {format(new Date(c.createdAt), "MMM dd, yyyy hh:mm a")}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default Blog;
