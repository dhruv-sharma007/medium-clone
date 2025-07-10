import { Link, useLocation } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { useAuthStore } from "../store/auth";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";

const SideBar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside>
      {/* Logo */}
      <Link to="/">
        <div className="flex justify-end items-center pr-10 pt-5">
          <img src="/wRITER.png" alt="logo" className="max-w-13 rounded-full" />
        </div>
      </Link>

      {/* Icons */}
      <section className="h-full text-4xl flex p-3 mt-3 pr-12 flex-col items-end gap-5">
        {/* Home */}
        <Link to="/" className="flex items-center">
          <GoHome
            className={`sidebar-icon ${isActive("/") ? "text-white border-r-8" : "text-gray-500"}`}
          />
        </Link>

        {/* Profile */}
        <Link to={`/profile/${user?.username}`} className="flex items-center">
          <FaUserAlt
            className={`sidebar-icon pr-[2px] ${location.pathname.startsWith("/profile") ? "text-white border-r-7" : "text-gray-500"}`}
          />
        </Link>

        <Link to={"/search"}>
          <IoIosSearch
            className={`sidebar-icon text-gray-500 ${location.pathname.startsWith("/search") ? "text-white border-r-7" : "text-gray-500"}`}
          />
        </Link>
        <Link to={"/create-post"}>
          <MdOutlineAddCircleOutline
            className={`sidebar-icon pr-[2px] ${location.pathname.startsWith("/create-post") ? "text-white border-r-7" : "text-gray-500"}`}
          />
        </Link>

        <Link
          to={`/profile/${user?.username}`}
          className="absolute bottom-8 group w-37 flex justify-end right-4"
        >
          <img
            src={user?.profilePic}
            alt="Profile"
            className="w-14 h-14 object-cover rounded-full cursor-pointer hover:ring"
          />
          <div className="absolute top-4 left-14 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out badge badge-ghost border-none rounded-sm bg-gray-500/45">
            Profile
          </div>
        </Link>
      </section>
    </aside>
  );
};

export default SideBar;
