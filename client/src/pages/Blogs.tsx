import InfiniteScroll from "react-infinite-scroll-component";
import { useGetPosts } from "../hooks";
import Post from "../components/Profile/Post";
import { RotateLoading } from "../components/Loading";

const Blogs = () => {
  const { blogs, fetchPost, hasMore } = useGetPosts();

  return (
    <div className="min-h-full mt-4 px-4 flex justify-center">
      <InfiniteScroll
        dataLength={blogs.length}
        next={fetchPost}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center p-10 min-h-full">
            <RotateLoading />
          </div>
        }
        endMessage={
          <p className="text-center text-gray-500 py-4">
            No more posts to load.
          </p>
        }
      >
        <div className="grid grid-cols-1 gap-5">
          {blogs
            .filter((blog) => blog.isPublished)
            .map((blog) => (
              <Post
                key={blog.id}
                authorBio={blog.user.bio}
                authorName={blog.user.name}
                comments={blog._count.comments}
                likes={blog._count.likes}
                featuredImage={blog.featuredImg}
                profileImage={blog.user.profilePic}
                title={blog.title}
                authorUsername={blog.user.username}
                blogId={blog.id}
                badge="hide"
                isPublished
              />
            ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Blogs;
