import { useLocation } from "react-router-dom";
import Search from "./ui/Search";

const RightBar = () => {
  const location = useLocation();
  return (
    <div className="w-full min-h-full border-l-[0.1px] border-l-gray-700">
      <section className="flex justify-center p-4 min-h-20">
        {location.pathname === "/search" ? "" : <Search />}
      </section>
    </div>
  );
};

export default RightBar;
