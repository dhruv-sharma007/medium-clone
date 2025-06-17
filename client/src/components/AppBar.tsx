import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const AppBar = () => {
  return (
    <>
      <div className="border-b flex justify-between px-10 py-3 items-center bg-white">
        <Link to={"/"}>
          <div className="font-bold text-3xl font-serif">Medium</div>
        </Link>
        <div>
          <Link to={"/create_post"} className="pr-3">
            <button className="btn btn-primary">Create Post</button>
          </Link>
          <Avatar name="Bablu" size={32} />
        </div>
      </div>
    </>
  );
};

export default AppBar;
