import React from 'react';

interface TagInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  tags: string[];
  onRemoveTag: (tag: string) => void;
  placeholder?: string;
}

export default function TagInput({
  label,
  value,
  onChange,
  onKeyDown,
  tags,
  onRemoveTag,
  placeholder = 'Type here',
}: TagInputProps): React.ReactElement {
  return (
    <div className="mb-6">
      <label className="block text-[14px] text-[#010101] mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#01010133] px-3 mb-[8px] py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
      />
      <div className="flex gap-2 flex-wrap">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC]"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="text-[#01010180]"
            >
              <img src="/icon/cancel.svg" alt="" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
