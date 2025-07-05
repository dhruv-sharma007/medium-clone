// import BlogCard from "../components/BlogCard";
import { useBlogs } from "../hooks";
import { RotateLoading } from "../components/Loading";
// import ProfileBlog from "../components/Profile/ProfileBlog";
import { useState } from "react";
import Post from "../components/Profile/Post";

const Blogs = () => {
  const [page, _] = useState<number>(1);
  const { blogs, loading } = useBlogs(page);

  return (
    <div className="min-h-screen  mt-4">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <RotateLoading />
        </div>
      ) : (
        <div className="h-full w-full  flex justify-center p-4">
          <div className="grid grid-cols-1 gap-5">
            {blogs?.posts
              .filter((blog) => blog.isPublished)
              .map((blog) => (
                
                <div key={blog.id} className=" ">
                  <Post
                    authorBio={blog.user.bio}
                    authorName={blog.user.name}
                    comments={blog._count.comments}
                    likes={blog._count.likes}
                    featuredImage={blog.featuredImg}
                    profileImage={blog.user.profilePic}
                    title={blog.title}
                    authorId={blog.user.id}
                    blogId={blog.id}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
