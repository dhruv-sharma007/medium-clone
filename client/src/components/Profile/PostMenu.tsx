import { CiMenuKebab, CiShare1 } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { useDeleteBlog, usePublishChange } from "../../hooks";
import { FaExchangeAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthorProfileStore } from "../../store/author";

const PostMenu = ({
  authorId,
  id,
  pubValue,
}: {
  authorId: string;
  id: string;
  pubValue: boolean;
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [publishValue, setPublishValue] = useState<boolean>(pubValue);
  const { deleteBlogHook, error, response } = useDeleteBlog();
  // const copyLink = useRef(`${window.location.origin}/blog/${id}`);
  const { changePublishHook, response: usePublishChangeResponse } =
    usePublishChange(id, publishValue);

  const { updateBlogPublishStatus, authorProfile } = useAuthorProfileStore();

  const onPublishChange = async () => {
    try {
      setPublishValue((prev) => !prev);
      await changePublishHook();
      if (usePublishChangeResponse?.success) {
        updateBlogPublishStatus(id, publishValue);
      }
      toast.success(
        usePublishChangeResponse?.message || "changed status of publish",
      );
      console.log(authorProfile);

      // window.location.reload();
    } catch (err) {
      const error = err as Error;
      toast.error(String(error?.message));
    }
  };

  const onDelete = async () => {
    try {
      await deleteBlogHook(id);
      toast.success("post deleted");
      console.log(response);
      navigate(0);
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
    navigator.clipboard
      .writeText(link)
      .then(() => toast.success("Copied!"))
      .catch((e) => {
        console.error(e);
        toast.error(e.message);
      });
  };
  return (
    <>
      <div className="dropdown dropdown-left z-20">
        <div
          tabIndex={0}
          role="button"
          className=" p-2 cursor-pointer rounded hover:bg-stone-200 bg-stone-100 m-1"
        >
          <CiMenuKebab />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          {/* delete button  */}
          {authorId === user?.username && (
            <li>
              <button onClick={onDelete} className=" flex justify-between">
                <p>Delete</p>
                <span className="text-2xl text-red-400 cursor-pointer">
                  <MdDelete />
                </span>
              </button>
            </li>
          )}
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
          {user?.username === authorId && (
            <li>
              <a className=" flex justify-between" onClick={onPublishChange}>
                <p>Make {publishValue ? "Unpublish" : "Publish"} </p>
                <span className="text-2xl text-gray-500 cursor-pointer">
                  <FaExchangeAlt />
                </span>
              </a>
            </li>
          )}

          {/* Edit post ends  */}
        </ul>
      </div>
    </>
  );
};
export default PostMenu;
