import AppBar from "../components/AppBar";
import Avatar from "../components/Avatar";
import { useAuthStore } from "../store/auth";
import ProfileBlog from "../components/Profile/ProfileBlog";
import { ScaleLoader } from "react-spinners";
import { signoutApi } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useGetProfile } from "../hooks";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logout } = useAuthStore();

  const { loading, response } = useGetProfile();
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      const res = await signoutApi();
      logout()
      if (res.data.success) navigate('/signin');
    } catch (err) {
      const error = err as Error
      toast.error(error.message)
    }
  }


  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <AppBar />
      </header>

      <div className="pt-20 px-6 max-w-xl ">
        <div className="ring rounded-xl shadow-md p-6 flex items-center space-x-6">
          <Avatar name={String(user?.name)} size={70} font_Size={35} />

          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              {user?.name}
            </h1>
            <span className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="btn btn-primary">Edit Profile</button>
              <button className="btn btn-error" onClick={onLogout}>Logout</button>
            </span>
          </div>
        </div>
      </div>

      <div className="divider divider-neutral">YOUR MEDIUM POSTS</div>

      {loading ? (
        <ScaleLoader />
      ) : (
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-250">
            {response?.data.Blogs.map((blog) => {
              return (
                <ProfileBlog
                  authorName={String(user?.name)}
                  content={blog.content}
                  id={blog.id}
                  title={blog.title}
                  key={blog.id}
                  page="profile"
                  authorId={blog.author.id}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
