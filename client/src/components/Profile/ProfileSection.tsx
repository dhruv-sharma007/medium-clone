import Avatar from "../Avatar";
import ProfileStat from "./ProfileStat";
import toast from "react-hot-toast";
import { signoutApi } from "../../lib/api";
import { Link, useNavigate } from "react-router-dom";
import { ProfilePicUrl } from "../../lib/static";
// import type { IGetProfileResponse } from "@medium-clone/common"; 
import { useAuthStore } from "../../store/auth";
import { useFollow } from "../../hooks";
import type { IGetProfileResp } from "../../vite-env";
// import { IoSettings } from "react-icons/io5";

const ProfileSection = ({
  author,
}: {
  author: IGetProfileResp | undefined;
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  console.log("--------", author);
  const { createFollowHook, response, deleteFollowHook } = useFollow();

  const onFollow = async (e: React.FormEvent) => {
    try {
      // e.preventDefault()
      await createFollowHook(author?.id);
      window.location.reload();
      toast.success(response?.message || "success");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };
  const onUnFollow = async (e: React.FormEvent) => {
    try {
      // e.preventDefault()
      await deleteFollowHook(author?.id);
      window.location.reload();
      toast.success(response?.message || "success");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const onLogout = async () => {
    try {
      await signoutApi();
      logout();
      navigate("/signin");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  return (
    <>
      <main className="pt-20 w-full max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row md:justify-between items-center gap-6 py-6 border-b">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Avatar
              imgUrl={author?.profilePic || ProfilePicUrl}
              size={80}
              font_Size={35}
              name={author?.name}
              id={author?.id}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {author?.name}
              </h1>
              <h2 className="text-gray-500">{author?.username}</h2>
              <p className="text-gray-700 mt-2">{author?.bio}</p>
            </div>
          </div>

          <div className="flex flex-col md:items-end w-full md:w-auto gap-4">
            <ProfileStat
              followers={author?.followers}
              following={author?.following}
              posts={author?.postCount}
            />

            {user?.id === author?.id ? (
              //   If user seeing the own profile
              <div className="flex gap-3">
                {/* settings */}
                {/* <span className=''>
                                    <Link to={'/profile-settings'}>
                                        <IoSettings size={33} cursor={'pointer'} />
                                    </Link>
                                </span> */}

                {/* Edit Profile */}
                <Link
                  to={"/profile-edit"}
                  className="btn btn-outline btn-sm rounded-lg"
                >
                  Edit Profile
                </Link>

                {/* Logout  */}
                <button
                  className="btn btn-outline btn-error btn-sm rounded-lg"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              //  If user seeing the profile of author
              <>
                <div className="flex gap-3">
                  {author?.isUserFollowing ? (
                    <>
                      <button
                        className="btn btn-dash btn-sm rounded-lg"
                        onClick={onUnFollow}
                      >
                        UNFOLLOW
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-info btn-sm rounded-lg"
                        onClick={onFollow}
                      >
                        {author?.isFollowedByAuthor ? (
                          <>FOLLOW BACK</>
                        ) : (
                          <>FOLLOW</>
                        )}
                      </button>

                      {/* add functionnality of follow unfollow */}
                    </>
                  )}
                  <button className="btn btn-info btn-sm rounded-lg">
                    Chat
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
        <br />
      </main>
    </>
  );
};

export default ProfileSection;
