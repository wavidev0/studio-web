import Link from "next/link";
import { useEffect } from "react";
import { IconBell, IconMenu2 } from "@tabler/icons-react";
import { RootStore, useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { openDialog } from "@/store/dialogSlice";
import { adminProfileGet } from "@/store/adminSlice";
import LazyImage from "@/extra/ImageFallback";
import NotificationDialog from "../user/NotificationDialogue";
import { projectName } from "@/utils/config";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { admin } = useSelector((state: RootStore) => state?.admin);
  const { dialogue, dialogueType } = useSelector((state: RootStore) => state.dialogue);

  useEffect(() => {
    dispatch(adminProfileGet());
  }, [dispatch]);

  return (
    <div className="mainNavbar webNav">
      <div className="navbar-inner">
        <div className="navbar-left">
          <button className="navToggle navbar-toggle-btn" id="toggle" aria-label="Toggle sidebar">
            <IconMenu2 size={18} />
          </button>
          <div className="logo-show-nav">
            <Link href="/dashboard" className="navbar-mobile-logo">
              {projectName}
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <button
            className="navbar-icon-btn"
            onClick={() => dispatch(openDialog({ type: "notification" }))}
            aria-label="Notifications"
          >
            <IconBell size={18} />
          </button>

          <div className="navbar-divider" />

          <Link href="/AdminData" className="navbar-profile">
            <LazyImage
              src={admin?.image || `/images/user.jpg`}
              alt="admin"
              width="32px"
              height="32px"
              style={{ borderRadius: "8px", objectFit: "cover", display: "block", flexShrink: 0 }}
            />
            <span className="navbar-admin-name">{admin?.name || "Admin"}</span>
          </Link>
        </div>
      </div>

      {dialogue && dialogueType === "notification" && (
        <div className="userTable">
          <NotificationDialog />
        </div>
      )}
    </div>
  );
};

export default Navbar;
