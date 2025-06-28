import { CiMenuKebab, CiEdit } from "react-icons/ci";
import { CiShare1 } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import { useDeleteBlog } from "../../hooks";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth";
import { ProfilePicUrl } from "../../lib/static";

const ProfileBlog = ({
  id,
  authorName,
  title,
  content,
  authorId,
  page,
  createdAt,
  authorPic
}: {
  id: string;
  authorName: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date
  page: 'profile' | 'home'
  authorPic: string
}) => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { deleteBlogHook, error, response } = useDeleteBlog();
  // const copyLink = useRef(`${window.location.origin}/blog/${id}`);

  const onDelete = async () => {
    try {
      await deleteBlogHook(id);
      toast.success("post deleted");
      console.log(response)
      navigate(0)
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    } finally {
      if (error) {
        toast.error(error.message);
      }
    }
  };

  const onCopy = () => {
    const link = `${window.location.origin}/blog/${id}`;
    navigator.clipboard.writeText(link)
      .then(() => toast.success('Copied!'))
      .catch((e) => {
        console.error(e)
        toast.error(e.message)
      });
  }

  return (
    <>

      <div className="p-3 ">
        <span className="ring ring-black">
          <div className="bg-white shadow-xs  ring ring-gray-500 rounded-xs  p-5 max-w-md space-y-4 hover:shadow-lg transition-shadow duration-100">
            <div className=" flex justify-between items-center">
              {/* avatar with name starts here */}
              <div className="flex items-center gap-3">
                <Avatar name="authorname" imgUrl={authorPic || ProfilePicUrl} />
                <div className="text-sm text-gray-600">
                  <p className="font-semibold">{authorName}</p>
                </div>
              </div>
              {/* avatar ends here */}

              {/* menu drop down starts here */}
              <div className="dropdown dropdown-start z-20">
                <div tabIndex={0} role="button" className="btn m-1">
                  <CiMenuKebab />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  {/* delete button  */}
                  {authorId === user?.id &&
                    <li>
                      <button onClick={onDelete} className=" flex justify-between">
                        <p>Delete</p>
                        <span className="text-2xl text-red-400 cursor-pointer">
                          <MdDelete />
                        </span>
                      </button>
                    </li>
                  }
                  {/* delete button ends*/}

                  {/* copy sharable link  */}
                  <li>
                    <button className=" flex justify-between" onClick={onCopy}>
                      <p>Copy Link</p>
                      <span className="text-2xl text-gray-500 cursor-pointer">
                        <CiShare1 />
                      </span>
                    </button>
                  </li>
                  {/* copy sharable link ends */}

                  {/* Edit post  */}
                  {page === 'profile' &&
                    <li>
                      <a className=" flex justify-between">
                        <p>Edit Post</p>
                        <span className="text-2xl text-gray-500 cursor-pointer">
                          <CiEdit />
                        </span>
                      </a>
                    </li>
                  }

                  {/* Edit post ends  */}

                </ul>
              </div>
              {/* menu drop down ends here */}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-400">{new Date(createdAt).toLocaleDateString()}</p>
            </div>

            <Link to={`/blog/${id}`}>
              <p className="text-gray-700 text-sm leading-relaxed">
                {content.slice(0, 100)}...
              </p>

              <div className="text-xs text-gray-500">
                ⏱ {Math.ceil(content.length / 100)} min read
              </div>
            </Link>
          </div>
        </span>
      </div>
    </>
  );
};

export default ProfileBlog;
