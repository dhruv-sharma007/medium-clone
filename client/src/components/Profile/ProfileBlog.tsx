import { CiMenuKebab, CiEdit } from "react-icons/ci";
import { CiShare1 } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";

const ProfileBlog = ({
    id,
    authorName,
    title,
    content,
}: {
    id: number;
    authorName: string;
    title: string;
    content: string;
}) => {
    return (
        <>
            <div className="p-3">
                <span className="ring ring-black">
                    <div className="bg-white shadow-xs cursor-pointer ring ring-gray-500 rounded-xs  p-5 max-w-md space-y-4 hover:shadow-lg transition-shadow duration-100">

                        <div className=" flex justify-between items-center">

                            {/* avatar with name starts here */}
                            <div className="flex items-center gap-3">
                                <Avatar name="authorname" />
                                <div className="text-sm text-gray-600">
                                    <p className="font-semibold">{authorName}</p>
                                </div>
                            </div>
                            {/* avatar ends here */}
                            
                            {/* menu drop down starts here */}
                            <div className="dropdown dropdown-start">
                                <div tabIndex={0} role="button" className="btn m-1">
                                    <CiMenuKebab />
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                                >
                                    {/* delete button  */}
                                    <li>
                                        <a className=" flex justify-between">
                                            <button>Delete</button>
                                            <button className="text-2xl text-red-400 cursor-pointer">
                                                <MdDelete />
                                            </button>
                                        </a>
                                    </li>
                                    {/* copy sharable link  */}
                                    
                                    <li>
                                        <a className=" flex justify-between">
                                            <button>Copy Link</button>
                                            <button className="text-2xl text-gray-500 cursor-pointer">
                                                <CiShare1 />
                                            </button>
                                        </a>
                                    </li>
                                    {/* Edit post  */}
                                    <li>
                                        <a className=" flex justify-between">
                                            <button>Edit Post</button>
                                            <button className="text-2xl text-gray-500 cursor-pointer">
                                                <CiEdit />
                                            </button>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* menu drop down ends here */}
                        </div>

                        <Link to={`/blog/${id}`}>
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>

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