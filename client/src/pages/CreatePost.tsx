import { useState } from "react";
import { usePostBlog } from "../hooks";
import toast from "react-hot-toast";
// import BarLoading from "../components/Loading"; 
import PostBlog from "../components/PostBlog";

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
      <PostBlog
        error={error}
        loading={loading}
        onSubmit={onSubmit}
        setContent={setContent}
        setTitle={setTitle} />
    </>
  );
};

export default CreatePost;
