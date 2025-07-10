import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import RightBar from "./RightBar";
import MobileDock from "./MobileDock";

const MainLayout = () => {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-40 bg-black text-white  relative border-r-[0.1px] border-stone-700 hidden md:block">
          <SideBar />
        </div>

        {/* Main content */}
        <div className="flex-1 h-full overflow-y-auto p-4 scrollbar-hide">
          <Outlet />
        </div>

        {/* RightBar */}
        <div className="min-w-40 hidden xl:block">
          <RightBar />
        </div>
        <div className="block md:hidden sticky bottom-0 z-50">
          <MobileDock />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
