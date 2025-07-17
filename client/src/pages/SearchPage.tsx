// import { useEffect, useState } from "react";
import Search from "../components/ui/Search";
import { useSearchPost, useSearchUser } from "../hooks";
// import type { ITopUser } from "../vite-env";
// import { getTopUsers } from "../lib/api";
// import toast from "react-hot-toast";
import AuthorInfo from "../components/Profile/AuthorInfo";
import Post from '../components/Profile/Post';

const SearchPage = () => {
  // const [topUsers, setTopUsers] = useState<ITopUser[]>([]); 
  const { users, setSearchTerm, searchTerm } = useSearchUser();
  const { posts } = useSearchPost(searchTerm);
  // const [isPosts, setIsPosts] = React.useState();

  // useEffect(() => {
  //   if (topUsers?.length === 0) {
  //     getTopUsers()
  //       .then((res) => {
  //         setTopUsers(res.data.data);
  //       })
  //       .catch((e) => toast.error(e.message));
  //   }
  // }, [topUsers]);

  return (
    <>
      <nav className="flex justify-center bg-gray-50">
        <div className="w-full max-w-md px-4">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </nav>

      <div className="flex flex-col sm:flex-row justify-center mt-4 min-h-[85vh] gap-6 px-4">

        <div className="w-full sm:w-1/3 max-h-[85vh] overflow-y-auto bg-white rounded-lg shadow">
          <ul className="p-4 space-y-3">
            {users ? users?.map((user) => (
              <li key={user.id}>
                <AuthorInfo author={user} />
              </li>
            )) : (
              <li className="text-center text-gray-500 mt-10">
                No profiles to display.
              </li>
            )}
          </ul>
        </div>

        <div className="w-full sm:w-2/3 h-[85vh] overflow-y-auto bg-white rounded-lg shadow">
          <ul className="p-4 space-y-6">
            {posts?.length !== undefined && posts?.length > 0 ? (
              posts?.map((blog) => (
                <li key={blog.id}>
                  <Post
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
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 mt-10">
                No posts to display.
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
