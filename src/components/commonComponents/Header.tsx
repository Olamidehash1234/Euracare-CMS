import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/GlobalComponents/Toast";
import LogoutConfirmModal from "./LogoutConfirmModal";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('loading');
  const [showToast, setShowToast] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setToastMessage('Logging out...');
    setToastType('loading');
    setShowToast(true);

    try {
      logout();
      
      // Show success briefly before redirecting
      setToastType('success');
      setToastMessage('Logged out successfully');
      setShowToast(true);

      setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 1000);
    } catch (err) {
      setToastType('error');
      setToastMessage('Failed to logout');
      setShowToast(true);
    } finally {
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onHide={() => setShowToast(false)}
      />

      <LogoutConfirmModal
        isOpen={showConfirm}
        isLoading={isLoggingOut}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancel}
      />

      <header className="bg-white sticky z-40 top-0 border-b px-[16px] lg:px-[40px] py-4 flex items-center justify-between min-h-[48px]">
        <h1 className="text-base font-semibold text-black">{title}</h1>
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          title="Logout"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <img src="/icon/logout.png" alt="" className="w-[24px]" />
        </button>
      </header>
    </>
  );
};

export default Header;