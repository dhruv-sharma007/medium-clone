import ProfileSection from "../components/Profile/ProfileSection";
import { useGetAuthor } from "../hooks";
import { RotateLoading } from "../components/Loading";
// import ProfileBlog from "../components/Profile/ProfileBlog";
import { useParams } from "react-router-dom";
import Post from "../components/Profile/Post";
import { useAuthorProfileStore } from "../store/author";

const Profile = () => {
  const { username } = useParams();

  const { error, loading } = useGetAuthor(username);
  const { authorProfile: author } = useAuthorProfileStore()
  // console.log(author);

  if (loading) return <RotateLoading />;

  if (error) {
    return (
      <div className="w-full flex items-center justify-center bg-black">
        <p className="text-red-300 font-semibold text-xl text-center px-4">
          {error.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <>
      <ProfileSection author={author} />

      <div className="h-full w-full grid grid-cols-1 2xl:grid-cols-3  gap-4 justify-items-center m-1 mb-2">
        {author?.Blogs.map((blog) => (
          <Post
            authorBio={author.bio}
            authorName={author.name}
            comments={blog._count.comments}
            likes={blog._count.likes}
            featuredImage={blog.featuredImg}
            profileImage={author.profilePic}
            title={blog.title}
            isPublished={blog.isPublished}
            authorUsername={author.username}
            key={blog.id}
            blogId={blog.id}
            badge="show"
          />
        ))}
      </div>
    </>
  );
};

export default Profile;
