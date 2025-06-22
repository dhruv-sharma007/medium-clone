import { useAuthStore } from "../store/auth";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const AppBar = () => {
  const { isLoggedIn } = useAuthStore()
  return (
    <>
      <div className="border-b flex justify-between px-10 py-3 items-center bg-white">
        <Link to={"/"}>
          <div className="font-bold text-3xl font-serif">Medium</div>
        </Link>
        {isLoggedIn ?
          <div>
            <Link to={"/create_post"} className="pr-3">
              <button className="btn btn-primary">Create Post</button>
            </Link>
            <Avatar name="Bablu" size={32} />
          </div>
          :
          <Link to={"/signin"} className="pr-3">
            <button className="btn btn-primary">LogIn</button>
          </Link>
        }
      </div>
    </>
  );
};

export default AppBar;
