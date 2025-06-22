import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const Avatar = ({
  name,
  size = 40,
  font_Size = 14,
}: {
  name: string;
  size?: number;
  font_Size?: number;
}) => {

  return (
    <Link to={"/profile"}>
      <div
        style={{ width: size, height: size }}
        className="relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full"
      >
        <span
          style={{ fontSize: font_Size }}
          className="font-extralight text-gray-600 dark:text-gray-300"
        >
          {name[0].toUpperCase()}
        </span>
      </div>
    </Link>
  );
};

export default Avatar;
