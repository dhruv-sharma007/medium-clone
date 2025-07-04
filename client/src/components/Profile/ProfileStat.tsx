const ProfileStat = ({
  following,
  followers,
  posts,
}: {
  following: number | undefined;
  followers: number | undefined;
  posts: number | undefined;
}) => {
  return (
    <div className="flex gap-6 text-center">
      <div>
        <p className="font-bold text-lg">{posts === undefined ? 0 : posts}</p>
        <p className="text-sm text-gray-500">Posts</p>
      </div>
      <div>
        <p className="font-bold text-lg">
          {String(followers).trim() === "" ? 0 : followers}
        </p>
        <p className="text-sm text-gray-500">Followers</p>
      </div>
      <div>
        <p className="font-bold text-lg">
          {String(following).trim() === "" ? 0 : following}
        </p>
        <p className="text-sm text-gray-500">Following</p>
      </div>
    </div>
  );
};

export default ProfileStat;
