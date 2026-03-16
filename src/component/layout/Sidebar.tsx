import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { warning } from "@/utils/Alert";
import { useDispatch } from "react-redux";
import { projectName } from "@/utils/config";
import { closeDialog } from "@/store/dialogSlice";
import Link from "next/link";
import $ from "jquery";
import {
  IconBuildingHospital, IconCalendarClock, IconBeach, IconCategoryPlus,
  IconCalendarEvent, IconMessageReply, IconCategory2, IconHome, IconLogout,
  IconRecharging, IconSettings, IconStars, IconUserQuestion, IconUsersGroup,
  IconTicket, IconDeviceDesktop, IconUserCircle, IconChevronDown,
} from "@tabler/icons-react";

const closeMobileSidebar = () => {
  if (window.innerWidth < 992) {
    $(".mainSidebar").removeClass("mobSidebar");
  }
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const handleLogout = async () => {
    const data = warning("Logout");
    data.then((logout: any) => {
      if (logout?.isConfirmed) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("key");
        sessionStorage.removeItem("isAuth");
        router.push("/", { scroll: true });
      }
    }).catch((err) => console.log(err));
  };

  const handleOnClick = () => {
    window && localStorage.removeItem("dialog");
    dispatch(closeDialog());
  };

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActive = (paths: string[]) =>
    paths.some((p) => pathname === p || pathname?.startsWith(p));

  const sections = [
    {
      label: "Menu",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: <IconHome size={17} />, active: ["/dashboard"] },
        { name: "Banner", path: "/Banner", icon: <IconDeviceDesktop size={17} />, active: ["/Banner"] },
      ],
    },
    {
      label: "Management",
      items: [
        {
          name: "Studio", icon: <IconBuildingHospital size={17} />, active: ["/DoctorTable", "/DoctorProfile", "/AddStudio"],
          sub: [
            { name: "All Studios", path: "/DoctorTable" },
            { name: "Add Studio", path: "/AddStudio" },
          ],
        },
        { name: "Users", path: "/User", icon: <IconUsersGroup size={17} />, active: ["/User", "/UserBooking", "/UserProfile"], onClick: handleOnClick },
        { name: "Reviews", path: "/Review", icon: <IconStars size={17} />, active: ["/Review"], onClick: handleOnClick },
        {
          name: "Feedback", icon: <IconMessageReply size={17} />, active: ["/Complain", "/Suggestion"],
          sub: [
            { name: "Complain", path: "/Complain" },
            { name: "Suggestion", path: "/Suggestion" },
          ],
        },
        { name: "Attendance", path: "/Attendence", icon: <IconCalendarEvent size={17} />, active: ["/Attendence"], onClick: handleOnClick },
      ],
    },
    {
      label: "Bookings",
      items: [
        {
          name: "Booking", icon: <IconCalendarClock size={17} />, active: ["/bookings/booking", "/bookings/dailybooking", "/bookings/monthlyReport"],
          sub: [
            { name: "All Bookings", path: "/bookings/booking" },
            { name: "Daily Bookings", path: "/bookings/dailybooking" },
            { name: "Monthly Report", path: "/bookings/monthlyReport" },
          ],
        },
      ],
    },
    {
      label: "Category",
      items: [
        { name: "Category", path: "/services", icon: <IconCategory2 size={17} />, active: ["/services"], onClick: handleOnClick },
        { name: "Suggest Category", path: "/SuggestedService", icon: <IconCategoryPlus size={17} />, active: ["/SuggestedService"], onClick: handleOnClick },
      ],
    },
    {
      label: "Finance",
      items: [
        { name: "Coupon", path: "/Coupon", icon: <IconTicket size={17} />, active: ["/Coupon"], onClick: handleOnClick },
        { name: "Withdrawal", path: "/Withdrawal", icon: <IconUserQuestion size={17} />, active: ["/Withdrawal"], onClick: handleOnClick },
        { name: "User Recharge", path: "/Recharge", icon: <IconRecharging size={17} />, active: ["/Recharge"], onClick: handleOnClick },
      ],
    },
    {
      label: "Settings",
      items: [
        { name: "Studio Holiday", path: "/DoctorHoliday", icon: <IconBeach size={17} />, active: ["/DoctorHoliday"], onClick: handleOnClick },
        { name: "Profile", path: "/AdminData", icon: <IconUserCircle size={17} />, active: ["/AdminData"], onClick: handleOnClick },
        { name: "Settings", path: "/Setting", icon: <IconSettings size={17} />, active: ["/Setting"], onClick: handleOnClick },
        { name: "Log Out", icon: <IconLogout size={17} />, onClick: handleLogout },
      ],
    },
  ];

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((sec) => {
      sec.items.forEach((item: any) => {
        if (item.sub && isActive(item.active)) {
          initial[item.name] = true;
        }
      });
    });
    setOpenMenus(initial);
  }, [pathname]);

  return (
    <>
      <SideMenuJS />
      <div className="sideBar webSidebar">
        {/* Logo */}
        <div className="sideBarLogo">
          <Link href="/dashboard" className="sidebar-logo-link">
            <div className="sidebar-logo-icon">
              <img src="/images/logo.png" alt="logo" width={20} height={20} />
            </div>
            <span className="sidebar-logo-text">{projectName}</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="navigation">
          {sections.map((section) => (
            <div key={section.label} className="sidebar-section">
              <p className="sideBarTitle sidebar-section-label">{section.label}</p>
              <ul className="sidebar-menu">
                {section.items.map((item: any) => {
                  const active = item.active ? isActive(item.active) : false;
                  const hasSubmenu = !!item.sub;
                  const isOpen = openMenus[item.name];

                  return (
                    <li key={item.name} className="sidebar-item">
                      {hasSubmenu ? (
                        <button
                          className={`sidebar-link sidebar-link-btn ${active ? "sidebar-link-active" : ""}`}
                          onClick={() => toggleMenu(item.name)}
                        >
                          <span className="sidebar-icon">{item.icon}</span>
                          <span className="sidebar-label">{item.name}</span>
                          <IconChevronDown
                            size={13}
                            className={`sidebar-chevron ${isOpen ? "sidebar-chevron-open" : ""}`}
                          />
                        </button>
                      ) : item.path ? (
                        <Link
                          href={item.path}
                          className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
                          onClick={() => { item.onClick?.(); closeMobileSidebar(); }}
                        >
                          <span className="sidebar-icon">{item.icon}</span>
                          <span className="sidebar-label">{item.name}</span>
                        </Link>
                      ) : (
                        <button
                          className="sidebar-link sidebar-link-btn sidebar-logout"
                          onClick={() => { item.onClick?.(); closeMobileSidebar(); }}
                        >
                          <span className="sidebar-icon">{item.icon}</span>
                          <span className="sidebar-label">{item.name}</span>
                        </button>
                      )}

                      {hasSubmenu && isOpen && (
                        <ul className="sidebar-submenu">
                          {item.sub.map((sub: any) => (
                            <li key={sub.path}>
                              <Link
                                href={sub.path}
                                className={`sidebar-sublink ${pathname === sub.path ? "sidebar-sublink-active" : ""}`}
                                onClick={closeMobileSidebar}
                              >
                                <span className="sidebar-subdot" />
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

export const SideMenuJS = () => {
  useEffect(() => {
    const isMobile = () => window.innerWidth < 992;

    const handleToggle = () => {
      if (isMobile()) {
        // mobile: slide sidebar in/out
        $(".mainSidebar").toggleClass("mobSidebar");
      } else {
        // desktop: collapse to icon-only
        $(".sideBar").toggleClass("mobSidebar webSidebar");
        $(".sideBarTitle").toggleClass("hidden");
        $(".sidebar-logo-text").toggleClass("hidden");
      }
    };

    // close sidebar when clicking outside on mobile
    const handleOutside = (e: any) => {
      if (
        isMobile() &&
        $(".mainSidebar").hasClass("mobSidebar") &&
        !$(".mainSidebar").is(e.target) &&
        $(".mainSidebar").has(e.target).length === 0 &&
        !$(".navToggle").is(e.target) &&
        $(".navToggle").has(e.target).length === 0
      ) {
        $(".mainSidebar").removeClass("mobSidebar");
      }
    };

    $(".navToggle").on("click", handleToggle);
    $(document).on("click", handleOutside);

    return () => {
      $(".navToggle").off("click", handleToggle);
      $(document).off("click", handleOutside);
    };
  }, []);

  return null;
};
