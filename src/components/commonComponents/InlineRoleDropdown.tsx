import { useEffect, useRef, useState } from 'react';

interface Props {
  options: string[];
  value?: string[]; // selected values from parent
  onChange?: (vals: string[]) => void;
  onApply?: () => void;
}

export default function InlineRoleDropdown({ options, value = [], onChange, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOutside = (e: Event) => {
      const el = containerRef.current;
      if (!el) return;
      const target = e.target as Node;
      if (!el.contains(target)) setOpen(false);
    };
    document.addEventListener('click', onOutside);
    document.addEventListener('touchstart', onOutside);
    return () => {
      document.removeEventListener('click', onOutside);
      document.removeEventListener('touchstart', onOutside);
    };
  }, []);

  const toggleItem = (v: string) => {
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v];
    onChange?.(next);
  };

  const apply = () => {
    onApply?.();
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* toggle button (keeps same styling) */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 px-[20px] py-[12px]"
        aria-expanded={open}
      >
        <span className="text-[#202224] text-[15px]">Role</span>
        <svg className="w-4 h-4 text-[#0C2141]" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        // panel styled to match the second image (large rounded panel, centered)
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 z-50 w-[88%] max-w-[720px] bg-white border border-[#E6E9EF] rounded-[18px] shadow-lg">
          <div className="px-6 lg:px-8 py-6 lg:py-8">
            <div className="mb-4">
              <div className="text-[18px] font-medium text-[#0C2141]">Select Role</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {options.map((r) => {
                const active = value.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleItem(r)}
                    className={`flex items-center justify-center py-2 px-4 rounded-full border text-[14px] ${
                      active
                        ? 'bg-[#0C2141] text-white border-transparent'
                        : 'bg-white text-[#111827] border-[#E6E9EF]'
                    }`}
                  >
                    {/* Label capitalization similar to image */}
                    {r}
                  </button>
                );
              })}
            </div>

            <div className="text-sm text-[#6B7280] mb-6">*You can choose multiple roles</div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={apply}
                className="px-6 py-2 rounded-md bg-[#082033] text-white text-sm shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
