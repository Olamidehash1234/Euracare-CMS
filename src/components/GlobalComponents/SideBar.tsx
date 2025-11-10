import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import OverviewIcon from "/icon/overview.svg"
import notificationIcon from "/icon/notification.svg"
import doctorsIcon from "/icon/doctor.svg"
import ourTeamIcon from "/icon/team.svg"
import servicesIcon from "/icon/services.svg"
import blogIcon from "/icon/news.svg"
import careerIcon from "/icon/careers.svg"
import adminIcon from "/icon/admin.svg"
import departmentIcon from "/icon/department.svg"
import activityIcon from "/icon/activity.svg"
import accreditationsIcon from "/icon/accreditations.svg"

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  pill?: boolean;
}

interface NavSection {
  general: NavItem[];
  pageManagement: NavItem[];
  system: NavItem[];
}

const items: NavSection = {
  general: [
    { id: "overview", label: "Overview", icon: OverviewIcon },
    { id: "notifications", label: "Notifications", icon: notificationIcon , badge: 12 },
  ],

  pageManagement: [
    { id: "doctors", label: "Doctors", icon: doctorsIcon },
    { id: "team", label: "Our Team", icon: ourTeamIcon },
    { id: "services", label: "Services", icon: servicesIcon },
    { id: "blogs", label: "Blogs & Articles", icon: blogIcon },
    { id: "accreditations", label: "Accreditations", icon: accreditationsIcon },
    { id: "careers", label: "Careers", icon: careerIcon },
  ],

  system: [
    { id: "admin", label: "Admin Management", icon: adminIcon },
    { id: "department", label: "Department", icon: departmentIcon },
    { id: "logs", label: "Activity Logs", icon: activityIcon },
  ],
};

interface SidebarProps {
  initialActiveItem?: string;
}

export default function DashboardSidebar({ initialActiveItem = "overview" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false); // desktop collapsed to icons-only
  const [open, setOpen] = useState<boolean>(false); // mobile drawer open
  const location = useLocation();
  const navigate = useNavigate();

  const pathToId = (path: string) => {
    if (!path || path === '/' || path === '/overview') return 'overview';
    if (path.startsWith('/notifications')) return 'notifications';
    if (path.startsWith('/doctors')) return 'doctors';
    if (path.startsWith('/team')) return 'team';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/blogs')) return 'blogs';
    if (path.startsWith('/careers')) return 'careers';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/department')) return 'department';
    if (path.startsWith('/logs')) return 'logs';
    if (path.startsWith('/accreditations')) return 'accreditations' // Fixed: changed ./accreditations to /accreditations
    return initialActiveItem;
  };

  const [active, setActive] = useState<string>(pathToId(location.pathname));

  useEffect(() => {
    setActive(pathToId(location.pathname));
  }, [location.pathname]);

  const navButtonCls = (isActive: boolean): string => [
      "flex items-center gap-3 px-[10px] py-[14px] rounded-[20px] transition-colors text-sm",
      isActive
        ? "text-[#0b2b4b] font-medium shadow-sm border-[1px] border-[#0C2141] rounded-[20px]"
        : "text-[#010101] hover:bg-white/30 hover:text-gray-900"
    ].join(" ");

  return (
    <>
      {/* Mobile top toggle (only shows on small screens) */}
      <div className="lg:hidden p-2">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
          className="inline-flex items-center gap-2 px-[10px] py-2 rounded-md bg-white shadow text-sm"
        >
          <svg className="" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Menu
        </button>
      </div>

      {/* Sidebar container (desktop & tablet) */}
      <aside
        className={`hidden lg:flex flex-col border-r-[1.5px] border-[#01010133] h-screen sticky top-0 px-[20px] pt-[8px] pb-[17px] transition-all duration-200 ${collapsed ? "w-20" : "w-64"}`}
        aria-label="Sidebar"
      >
        {/* top logo + collapse toggle */}
        <div className="flex items-center justify-between pb-[14px] border-b border-[#01010133]">
            <div className={`flex items-center justify-center ${collapsed ? "hidden" : ""}`}>
              <img src="/logo.svg" alt="" className="object-cover"/>
            </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed((s) => !s)}
              aria-pressed={collapsed}
              title={collapsed ? "Expand" : "Collapse"}
              className="p-2 rounded-md hover:bg-gray-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d={collapsed ? "M6 12h12M12 6l6 6-6 6" : "M18 12H6M12 6l-6 6 6 6"} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-auto scrollbar-hide pb-">
          {/* General */}
          <div>
            {!collapsed && <div className="text-xs text-[#010101] uppercase mt-[18px] mb-2 px-1">General</div>}
            <nav className="flex flex-col gap-1 mb-[15px]">
              {items.general.map((it) => {
                const isActive = active === it.id;
                const handleClick = () => {
                  setActive(it.id);
                  navigate(`/${it.id === "overview" ? "" : it.id}`, { replace: true });
                };
                return (
                  <button
                    key={it.id}
                    onClick={handleClick}
                    className={navButtonCls(isActive)}
                    aria-current={isActive ? "page" : undefined}
                    title={it.label}
                  >
                    <span className="flex-shrink-0">
                      <img src={it.icon as string} className="" alt={it.label} />
                    </span>

                    {!collapsed && (
                      <div className="flex-1 flex items-center">
                        <span className="flex-1 text-[#010101] text-left">{it.label}</span>
                        {it.badge ? (
                          <span className="inline-flex items-center justify-center min-w-[28px] h-6 rounded-[50px] bg-[#0C2141] text-white text-xs px-2">
                            {it.badge}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Divider */}
          <div className="border-t border-[#01010133]" />

          {/* Page Management */}
          <div>
            {!collapsed && <div className="text-xs text-[#010101] mt-[18px] uppercase mb-2 px-1">Page Management</div>}
            <nav className="flex flex-col gap-1 mb-[15px]">
              {items.pageManagement.map((it) => {
                const isActive = active === it.id;
                const handleClick = () => {
                  setActive(it.id);
                  navigate(`/${it.id}`, { replace: true });
                };
                return (
                  <button
                    key={it.id}
                    onClick={handleClick}
                    className={navButtonCls(isActive)}
                    title={it.label}
                  >
                    <span className="flex-shrink-0">
                      <img src={it.icon as string} className="" alt={it.label} />
                    </span>

                    {!collapsed && (
                      <>
                        <span className="flex-1 text[#010101] text-left">{it.label}</span>
                        {it.pill ? (
                          <span className="inline-flex items-center justify-center px-[10px] py-1 border border-gray-200 text-xs rounded-full text-gray-700 bg-white"> {/* pill */}
                            {/* empty to mimic the highlighted outline in screenshot */}
                          </span>
                        ) : null}
                      </>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-[#01010133]" />

          {/* System Management */}
          <div>
            {!collapsed && <div className="text-xs text-[#010101] mt-[18px] uppercase mb-2 px-1">System Management</div>}
            <nav className="flex flex-col gap-1 mb-[15px]">
              {items.system.map((it) => {
                const isActive = active === it.id;
                const handleClick = () => {
                  setActive(it.id);
                  if (it.id === "admin") navigate("/admin");
                  if (it.id === "department") navigate("/department");
                  if (it.id === "logs") navigate("/logs");
                };
                return (
                  <button
                    key={it.id}
                    onClick={handleClick}
                    className={navButtonCls(isActive)}
                    title={it.label}
                  >
                    <span className="flex-shrink-0">
                      <img src={it.icon as string} className="" alt={it.label} />
                    </span>

                    {!collapsed && <span className="flex-1 text[#010101] text-left">{it.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg p-4 overflow-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-between mb-6">
              <img src="/logo.svg" alt="" />
              <button onClick={() => setOpen(false)} className="p-2 rounded-md">
                <svg className="" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* reuse same sections shown earlier but mobile expands full label */}
              <div>
                <div className="text-xs text-[#010101] uppercase mb-2">General</div>
                <nav className="flex flex-col gap-1 mb-[15px]">
                  {items.general.map((it) => (
                    <button key={it.id} onClick={() => { setActive(it.id); setOpen(false); }} className="flex items-center gap-3 px-[10px] py-2 rounded-[20px] text-sm hover:bg-gray-50">
                      <span className="flex-shrink-0">
                        <img src={it.icon as string} className="" alt={it.label} />
                      </span>
                      <span className="flex-1 text[#010101] text-left">{it.label}</span>
                      {it.badge ? <span className="inline-flex items-center justify-center min-w-[28px] h-6 rounded-full bg-sky-600 text-white text-xs px-2">{it.badge}</span> : null}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-[#01010133]" />

              <div>
                <div className="text-xs text-[#010101] uppercase mb-2">Page Management</div>
                <nav className="flex flex-col gap-1 mb-[15px]">
                  {items.pageManagement.map((it) => (
                    <button key={it.id} onClick={() => { setActive(it.id); setOpen(false); }} className="flex items-center gap-3 px-[10px] py-2 rounded-[20px] text-sm hover:bg-gray-50">
                      <span className="flex-shrink-0"><img src={it.icon as string} className="" alt={it.label} /></span>
                      <span className="flex-1 text[#010101] text-left">{it.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-[#01010133]" />

              <div>
                <div className="text-xs text-[#010101] uppercase mb-2">System Management</div>
                <nav className="flex flex-col gap-1 mb-[15px]">
                  {items.system.map((it) => (
                    <button key={it.id} onClick={() => { setActive(it.id); setOpen(false); }} className="flex items-center gap-3 px-[10px] py-2 rounded-[20px] text-sm hover:bg-gray-50">
                      <span className="flex-shrink-0"><img src={it.icon as string} className="" alt={it.label} /></span>
                      <span className="flex-1 text[#010101] text-left">{it.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
