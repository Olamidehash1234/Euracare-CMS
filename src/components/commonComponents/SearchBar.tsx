// import React from 'react';

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = 'Search Here' }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="flex items-center w-full gap-[7px] lg:w-[80%] lg:gap-[16px] bg-[#F8F8F8] border border-[#0c214133] rounded-full py-[12px] lg:px-[20px] px-[24px] lg:px-[33px] relative">
        <img src="/icon/search.svg" alt="" className="w-[20px] h-[20px] lg:w-auto lg:h-auto" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full outline-none bg-[#F8F8F8] text-[14px] lg:text-[16px] text-[#0C2141] placeholder:text-[#0C214166]"
        />
      </div>
    </div>
  );
}
