import BlogCard from "../components/BlogCard";
import AppBar from "../components/AppBar";
import { useBlogs } from "../hooks";
import { RotateLoading } from "../components/Loading";

const Blogs = () => {
  const { blogs, loading } = useBlogs()
  if (loading) return <div className="flex justify-center items-center min-h-screen"><RotateLoading /></div>;

  return (
    <div>
      <div className=" fixed w-full z-10">
        <AppBar />
      </div>
      <div className="h-full grid grid-cols-1">
        {blogs?.map((blog) => (
          <BlogCard
            authorName={blog.author.name}
            content={blog.content}
            title={blog.title}
            key={blog.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
