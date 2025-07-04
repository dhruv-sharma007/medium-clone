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
    <div className="min-h-screen min-w-screen mt-4">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <RotateLoading />
        </div>
      ) : (
        <div className="h-full w-full flex justify-center p-4">
          <div className="grid grid-cols-1 pt-15 gap-5">
            {blogs?.posts
              .filter((blog) => blog.isPublished)
              .map((blog) => (
                // <ProfileBlog
                //   authorPic={blog.user.profilePic}
                //   authorName={blog.user.name}
                //   createdAt={blog.createdAt}
                //   authorId={blog.user.id}
                //   title={blog.title}
                //   id={blog.id}
                //   page="home"
                //   key={blog.id}
                // />
                <div key={blog.id} className="scale-125 p-24">
                  <Post
                    authorBio={blog.user.bio}
                    authorName={blog.user.name}
                    comments={blog._count.comments}
                    likes={blog._count.likes}
                    featuredImge={blog.featuredImg}
                    profileImage={blog.user.profilePic}
                    title={blog.title}
                    // isPublished={blog.isPublished} 
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
