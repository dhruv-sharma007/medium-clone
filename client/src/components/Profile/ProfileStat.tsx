const ProfileStat = ({
  following,
  followers,
  posts,
}: {
  following: number;
  followers: number;
  posts: number;
}) => {
  return (
    <div className="flex gap-6 text-center">
      <div>
        <p className="font-bold text-lg">{posts}</p>
        <p className="text-sm text-gray-500">Posts</p>
      </div>
      <div>
        <p className="font-bold text-lg">{followers}</p>
        <p className="text-sm text-gray-500">Followers</p>
      </div>
      <div>
        <p className="font-bold text-lg">{following}</p>
        <p className="text-sm text-gray-500">Following</p>
      </div>
    </div>
  );
};

export default ProfileStat;
