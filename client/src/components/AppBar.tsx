import { useAuthStore } from "../store/auth";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const AppBar = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="border-b flex flex-wrap justify-between items-center px-4 sm:px-8 py-3 bg-white shadow-sm">

      <Link to="/">
        <div className="font-bold text-2xl sm:text-3xl font-serif">Medium</div>
      </Link>

      {isLoggedIn ? (
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <Link to="/create_post">
            <button className="btn btn-primary">Create Post</button>
          </Link>
          <Avatar imgUrl="https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg" size={32} />
        </div>
      ) : (
        <Link to="/signin" className="mt-3 sm:mt-0">
          <button className="btn btn-primary">Log In</button>
        </Link>
      )}
    </div>
  );
};

export default AppBar;
