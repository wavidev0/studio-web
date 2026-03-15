import UserTable from "@/component/user/UserTable";
import RootLayout from "@/component/layout/Layout";
import { useState } from "react";
import { IconLayoutGrid, IconLayoutList, IconUsers } from "@tabler/icons-react";

const User = () => {
  const [view, setView] = useState<"list" | "kanban">("list");

  return (
    <div className="dt-page">
      <div className="dt-toolbar">
        <div className="dt-tabs">
          <button className="dt-tab dt-tab-active">
            <IconUsers size={15} />
            All Users
          </button>
        </div>
        <div className="dt-view-toggle">
          <button
            className={`dt-view-btn ${view === "list" ? "dt-view-active" : ""}`}
            onClick={() => setView("list")}
            title="List view"
          >
            <IconLayoutList size={16} />
          </button>
          <button
            className={`dt-view-btn ${view === "kanban" ? "dt-view-active" : ""}`}
            onClick={() => setView("kanban")}
            title="Card view"
          >
            <IconLayoutGrid size={16} />
          </button>
        </div>
      </div>

      <UserTable view={view} />
    </div>
  );
};

User.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default User;
