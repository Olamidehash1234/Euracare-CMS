import { Outlet, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import SideBar from "./SideBar";
// import Header from "./Header";
// import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import Toast from "./Toast";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";

const Layout = () => {
  const [showSessionTimeoutToast, setShowSessionTimeoutToast] = useState(false);
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);

  // Handle session timeout events
  useSessionTimeout({
    onSessionTimeout: () => {
      // Only show toast and redirect once
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        setShowSessionTimeoutToast(true);
        
        // Auto-redirect after toast is shown
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 1500);
      }
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
