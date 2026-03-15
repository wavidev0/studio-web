import DoctorComplain from "@/component/complain/DoctorComplain";
import UserComplain from "@/component/complain/UserComplain";
import RootLayout from "@/component/layout/Layout";
import { IconUser, IconBuildingStore } from "@tabler/icons-react";
import React, { useState } from "react";

const Complain = () => {
  const [type, setType] = useState<string>("user");

  const tabs = [
    { key: "user",   label: "User Complaints",   icon: <IconUser size={15} /> },
    { key: "studio", label: "Studio Complaints",  icon: <IconBuildingStore size={15} /> },
  ];

  return (
    <div className="dt-page">
      <div className="dt-toolbar">
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
      </div>
      {type === "user"   && <UserComplain />}
      {type === "studio" && <DoctorComplain />}
    </div>
  );
};

Complain.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default Complain;
