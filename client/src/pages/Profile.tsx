import ProfileSection from '../components/Profile/ProfileSection';
import { useGetAuthor } from '../hooks';
import { RotateLoading } from '../components/Loading';
import ProfileBlog from '../components/Profile/ProfileBlog';
import { useParams } from 'react-router-dom';
import Post from '../components/Profile/Post';

const Profile = () => {
  const { id } = useParams()

  const { error, loading, author } = useGetAuthor(id)
  console.log(author);

  if (loading) return <RotateLoading />

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <p className="text-red-300 font-semibold text-xl text-center px-4">
          {error.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <>
      <ProfileSection author={author} />

      <div className='p-5 h-full w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
        <Post />
      </div>

      {/* <div className="h-full grid grid-cols-1 pt-15 pl-5 pr-5 sm:grid-cols-2 md:grid-cols-3">
        {author?.Blogs?.map((blog) => (
          <ProfileBlog
            authorName={author.name}
            content={blog.content}
            title={blog.title}
            id={blog.id}
            key={blog.id}
            authorId={author.id}
            createdAt={blog.createdAt}
            page="profile"
            authorPic={author.profilePic}
          />
        ))}
      </div> */}


    </>
  );
};

export default Profile;
