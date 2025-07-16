import { Link } from "react-router-dom";
import type { ITopUser } from "../../vite-env";

const AuthorInfo = ({ author }: { author: ITopUser }) => {
  // console.log('',author);

  return (
    <>
      <section className="flex justify-between items-start mb-3">
        <Link
          to={`/profile/${author.username}`}
          className="flex gap-3 items-center"
        >
          <img
            src={
              author.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/3682/3682281.png"
            }
            alt={`${author.name}'s profile`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold">{author.name}</p>
            <p className="text-xs text-gray-500 max-w-[160px] truncate">
              {author.bio}
            </p>
          </div>
        </Link>
      </section>
    </>
  );
};

export default AuthorInfo;
