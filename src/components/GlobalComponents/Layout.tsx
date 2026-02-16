import { Outlet } from "react-router-dom";
import { useState } from "react";
import SideBar from "./SideBar";
// import Header from "./Header";
// import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import Toast from "./Toast";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";

const Layout = () => {
  const [showSessionTimeoutToast, setShowSessionTimeoutToast] = useState(false);

  // Handle session timeout events - show toast
  // AuthContext handles the actual logout and redirect
  useSessionTimeout({
    onSessionTimeout: () => {
      setShowSessionTimeoutToast(true);
      
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setShowSessionTimeoutToast(false);
      }, 3000);
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Toast
        message="Your session has expired. Please log in again."
        type="error"
        show={showSessionTimeoutToast}
        onHide={() => setShowSessionTimeoutToast(false)}
      />
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
