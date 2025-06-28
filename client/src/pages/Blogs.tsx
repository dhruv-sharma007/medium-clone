// import BlogCard from "../components/BlogCard";
import { useBlogs } from "../hooks";
import { RotateLoading } from "../components/Loading";
import ProfileBlog from "../components/Profile/ProfileBlog";

const Blogs = () => {
  const { blogs, loading } = useBlogs();

  return (
    <div>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <RotateLoading />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="h-full grid grid-cols-1 pt-15 ">
            {blogs?.map((blog) => (
              <ProfileBlog
                authorName={blog.user.name}
                content={blog.content}
                title={blog.title}
                id={blog.id}
                key={blog.id}
                authorId={blog.user.id}
                createdAt={blog.createdAt}
                page="home"
                authorPic={blog.user.profilePic}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
