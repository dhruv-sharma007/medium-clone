import { BiLike } from "react-icons/bi";
import { MdOutlineInsertComment } from "react-icons/md";
import { Link } from "react-router-dom";
import Published from '../ui/Published';
import PostMenu from '../PostMenu';

interface PostProps {
  profileImage: string;
  authorName: string;
  authorBio: string;
  title: string;
  featuredImage: string;
  likes: number;
  comments: number;
  isPublished?: boolean;
  authorId: string;
  blogId: string;
}

const Post = ({
  profileImage,
  authorName,
  authorBio,
  title,
  featuredImage,
  likes,
  comments,
  isPublished,
  authorId,
  blogId,
}: PostProps) => {
  return (
    <div className="min-w-120 max-w-150 max-h-188 rounded-xl p-4 bg-white shadow-md transition hover:shadow-lg">
      {/* Author Info */}
      <section className="flex justify-between items-start mb-3">
        <Link to={`/profile/${authorId}`} className="flex gap-3 items-center">
          <img
            src={profileImage}
            alt={`${authorName}'s profile`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold">{authorName}</p>
            <p className="text-xs text-gray-500 max-w-[160px] truncate">{authorBio}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {isPublished && <Published isPublished />}
          <PostMenu authorId={authorId} id={blogId} />
        </div>
      </section>

      {/* Title + Image */}
      <section className="mb-3">
        <p className="text-sm font-semibold text-gray-800 mb-2 truncate w-full">{title}</p>
        <img
          src={featuredImage}
          alt="Blog cover"
          className="w-full h-140 object-cover rounded-lg bg-gray-200"
        />
      </section>

      {/* Stats */}
      <section className="flex justify-between px-8 text-xs text-gray-600 mb-2">
        <p><span className="font-bold">{likes}</span> Likes</p>
        <p><span className="font-bold">{comments}</span> Comments</p>
      </section>

      {/* Actions */}
      <section className="flex justify-around border-t border-gray-200 pt-2">
        <button>
          <BiLike className="text-blue-500" size={24} />
        </button>
        <button>
          <MdOutlineInsertComment className="text-gray-600" size={24} />
        </button>
      </section>
    </div>
  );
};

export default Post;
