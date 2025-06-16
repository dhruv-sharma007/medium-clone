import { Link } from "react-router-dom";
import Avatar from "./Avatar";

interface IBlogcard {
  authorName: string;
  title: string;
  content: string;
  // publishedDate: string;
}

const BlogCard = ({ authorName, content, title, id }: IBlogcard) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="bg-white shadow-xs cursor-pointer border-b p-5 max-w-md mx-auto space-y-4 hover:shadow-lg transition-shadow duration-100">
        <div className="flex items-center gap-3">
          <Avatar name={authorName} />
          <div className="text-sm text-gray-600">
            <p className="font-semibold">{authorName}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800">{title}</h2>

        <p className="text-gray-700 text-sm leading-relaxed">
          {content.slice(0, 100)}...
        </p>

        <div className="text-xs text-gray-500">
          ⏱ {Math.ceil(content.length / 100)} min read
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
