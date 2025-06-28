import { Link } from "react-router-dom";
// import { useAuthStore } from "../store/auth";

const Avatar = ({
  imgUrl,
  size = 40,
  font_Size = 14,
  name = "?", 
}: {
  imgUrl?: string;
  size?: number;
  font_Size?: number;
  name?: string;
}) => {
  return (
    <Link to="/profile">
      <div
        style={{ width: size, height: size }}
        className="relative inline-flex items-center justify-center overflow-hidden bg-gray-700 rounded-full"
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            style={{ fontSize: font_Size }}
            className="text-white font-semibold"
          >
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </Link>
  );
};

export default Avatar;

