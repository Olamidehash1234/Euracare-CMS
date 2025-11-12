import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => (
  <header className="bg-white sticky z-40 top-0 border-b px-[16px] lg:px-[40px] py-4 flex items-center min-h-[48px]">
    <h1 className="text-base font-semibold text-black">{title}</h1>
  </header>
);

export default Header;