import { useState } from "react";
import AppBar from "../components/AppBar";
import { usePostBlog } from "../hooks";
import toast from "react-hot-toast";
import BarLoading from "../components/Loading";

const CreatePost = () => {
  const { error, loading, postBlog, response } = usePostBlog();
  const [content, setContent] = useState<string>();
  const [title, setTitle] = useState<string>();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ([title || content].some((field) => field?.trim() === "")) {
      return toast.error("Both field are required");
    }
    
    try {
      postBlog({
        content: String(content),
        title: String(title),
      });

      if (response?.success) {
        toast.success(response.message);
      } else if (response?.success === false) {
        toast.error(response?.message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="fixed w-full z-20">
        <AppBar />
      </div>
      <div className="flex justify-center items-center min-h-screen px-4">
        <form
          className="w-full max-w-xl space-y-4 bg-white p-6 rounded-2xl shadow-md"
          onSubmit={onSubmit}
        >
          <h2 className="text-2xl font-semibold text-center">Create Post</h2>
          {loading && (
            <div className="flex justify-center">
              <BarLoading />
            </div>
          )}

          <input
            type="text"
            name="title"
            placeholder="Enter your title"
            className="input input-bordered w-full"
            onChange={(e) => setTitle(e.target.value)}
            minLength={3}
          />

          <textarea
            name="content"
            placeholder="Enter your content"
            className="textarea textarea-bordered w-full min-h-[150px]"
            onChange={(e) => setContent(e.target.value)}
            minLength={10}
          ></textarea>

          <button type="submit" className="btn btn-primary w-full">
            Submit
          </button>
        </form>
        {error && (
          <>
            <div className="inline-grid *:[grid-area:1/1]">
              <div className="status status-error animate-ping"></div>
              <div className="status status-error"></div>
            </div>
            {error.message}
          </>
        )}
      </div>
    </>
  );
};

export default CreatePost;
