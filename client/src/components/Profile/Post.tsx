import { BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineInsertComment } from "react-icons/md";
import Published from '../ui/Published';
import PostMenu from '../PostMenu';

const Post = ({
    profileImage,
    authorName,
    authorBio,
    title,
    featuredImge,
    likes,
    comments,
    isPublished,
    authorId
}: {
    profileImage: string;
    authorName: string;
    authorBio: string;
    title: string;
    featuredImge: string;
    likes: number;
    comments: number;
    isPublished?: boolean;
    authorId: string
}) => {
    return (
        <>
            <div className="max-w-140 rounded-xl p-2.5 bg-white shadow">
                <div>
                    {/* upper section  */}
                    <section className="flex justify-between mt-2 mb-2">
                        {/* This will contain profile pic of author, name, bio, content, image  */}
                        <div className="flex items-center gap-3">
                            <span>
                                {/* profilePic  */}
                                <img
                                    className="rounded-full w-12 h-12 object-cover"
                                    src={profileImage}
                                    alt=""
                                />
                            </span>
                            <div>
                                {/* name and content  */}
                                <p className="font-bold">{authorName}</p>
                                <p className="text-xs text-gray-500 max-w-[160px] truncate">
                                    {authorBio}
                                </p>
                            </div>
                        </div>

                        {isPublished && <Published isPublished={isPublished} />}

                        <PostMenu authorId={authorId} id="" />
                    </section>

                    {/* middle section  */}
                    <section className="mb-4">
                        <p className="text-sm text-gray-800 mb-2 truncate w-96">{title}</p>
                        <div>
                            <img
                                src={featuredImge}
                                alt="blogImage"
                                className="rounded-lg w-full h-auto min-h-140 object-cover bg-[#e7e7e7]"
                            />
                        </div>
                    </section>

                    {/*  stat  */}
                    <section>
                        <div className="flex justify-between text-xs text-gray-600 mb-2 px-8">
                            <p>
                                {" "}
                                <span className="font-bold">{likes}</span> LIKES
                            </p>
                            <p>
                                <span className="font-bold">{comments}</span> COMMENTS
                            </p>
                        </div>
                    </section>

                    {/* lower section  */}
                    <section className="flex justify-around pt-2 border-t border-gray-100">
                        <button>
                            <BiLike className="text-blue-500" size={24} />
                        </button>
                        <button>
                            <MdOutlineInsertComment className="text-gray-600" size={24} />
                        </button>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Post;
