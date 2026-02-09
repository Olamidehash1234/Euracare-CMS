import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
// import Header from "./Header";
// import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <div className="flex flex-row flex-grow">
        <SideBar />
        <div className="flex flex-col flex-grow">
          <main className="flex-grow bg-[#fafbfc]">
            <Outlet />
          </main>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
