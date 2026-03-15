import AddDoctor from "@/component/doctor/AddDoctor";
import AllDoctor from "@/component/doctor/AllDoctor";
import PendingRequest from "@/component/doctor/PendingRequest";
import RejectedRequest from "@/component/doctor/RejectedRequest";
import RootLayout from "@/component/layout/Layout";
import { RootStore } from "@/store/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  IconBuildingStore,
  IconClock,
  IconCircleX,
  IconLayoutGrid,
  IconLayoutList,
} from "@tabler/icons-react";

const tabs = [
  { key: "All Studios", label: "All Studios", icon: <IconBuildingStore size={15} /> },
  { key: "pending",     label: "Pending",     icon: <IconClock size={15} /> },
  { key: "rejected",    label: "Rejected",    icon: <IconCircleX size={15} /> },
];

const DoctorTable = () => {
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);
  const [type, setType]   = useState("All Studios");
  const [view, setView]   = useState<"list" | "kanban">("list");

  return (
    <div className="dt-page">
      {dialogueType !== "doctor" && (
        <div className="dt-toolbar">
          {/* Pill Tabs */}
          <div className="dt-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`dt-tab ${type === t.key ? "dt-tab-active" : ""}`}
                onClick={() => setType(t.key)}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* View toggle — only on All Studios */}
          {type === "All Studios" && (
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
          )}
        </div>
      )}

      <div className={dialogueType === "doctor" ? "d-none" : ""}>
        {type === "All Studios" && <AllDoctor view={view} />}
        {type === "pending"     && <PendingRequest />}
        {type === "rejected"    && <RejectedRequest />}
      </div>

      {dialogueType === "doctor" && <AddDoctor />}
    </div>
  );
};

DoctorTable.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default DoctorTable;
