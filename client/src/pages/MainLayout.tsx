import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import RightBar from '../components/RightBar';

const MainLayout = () => {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}

        <SideBar />

        {/* Main content */}
        <div className="flex-1 h-full overflow-y-auto p-4 scrollbar-hide">
          <Outlet />
        </div>

        {/* RightBar */}
        <div className="min-w-100">
          <RightBar />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
