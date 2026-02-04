import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (searchTerm: string) => void;
  value?: string;
  className?: string;
}

export default function SearchBar({ placeholder = 'Search Here', onSearch, value = '', className = '' }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center w-full gap-[7px] lg:w-[100%] lg:gap-[16px] bg-[#F8F8F8] border border-[#0c214133] rounded-full py-[12px] lg:px-[20px] px-[24px] lg:px-[33px] relative">
        <img src="/icon/search.svg" alt="" className="w-[20px] h-[20px] lg:w-auto lg:h-auto" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="w-full outline-none bg-[#F8F8F8] text-[14px] lg:text-[16px] text-[#0C2141] placeholder:text-[#0C214166]"
        />
      </div>
    </div>
  );
}
