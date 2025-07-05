import { Outlet } from "react-router-dom";
import SideBar from '../components/SideBar';


const MainLayout = () => {

  return (
    <>
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <SideBar />

        {/* Main content */}
        <div className="flex-1 h-full overflow-y-auto">
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
