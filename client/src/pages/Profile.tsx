
import ProfileSection from '../components/Profile/ProfileSection';
import { useGetProfile } from '../hooks';
import { RotateLoading } from '../components/Loading';
import ProfileBlog from '../components/Profile/ProfileBlog';

const Profile = () => {
  const { error, loading, profile } = useGetProfile()


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
      <ProfileSection profile={profile} />

      <div className="h-full grid grid-cols-1 pt-15 pl-5 pr-5 sm:grid-cols-2 md:grid-cols-3">
        {profile?.Blogs?.map((blog) => (
          <ProfileBlog
            authorName={profile.name}
            content={blog.content}
            title={blog.title}
            id={blog.id}
            key={blog.id}
            authorId={profile.id}
            createdAt={blog.createdAt}
            page="home"
          />
        ))}
      </div>

    </>
  );
};

export default Profile;
