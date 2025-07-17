import { Link } from 'react-router-dom';
const ProfileStat = ({
  following,
  followers,
  posts,
  id
}: {
  following: number | undefined;
  followers: number | undefined;
  posts: number | undefined;
  id: string | undefined;
}) => {
  return (
    <div className="flex gap-6 text-center">
      <div>
        <p className="font-bold text-lg">{posts === undefined ? 0 : posts}</p>
        <p className="text-sm text-gray-500">Posts</p>
      </div>
      <div>
        <Link to={`/profile-stat/${id}`}>
          <p className="font-bold text-lg">
            {String(followers).trim() === "" ? 0 : followers}
          </p>
          <p className="text-sm text-gray-500">Followers</p>
        </Link>
      </div>
      <div>
        <Link to={`/profile-stat/${id}`}>
          <p className="font-bold text-lg">
            {String(following).trim() === "" ? 0 : following}
          </p>
          <p className="text-sm text-gray-500">Following</p>
        </Link>
      </div>
    </div>
  );
};

export default ProfileStat;
