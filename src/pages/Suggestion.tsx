import React, { useEffect, useState } from "react";
import RootLayout from "@/component/layout/Layout";
import { useSelector } from "react-redux";
import { RootStore, useAppDispatch } from "@/store/store";
import { getDoctorSuggestion, getUserSuggestion } from "@/store/suggestionSlice";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { IconUser, IconBuildingStore, IconCopy } from "@tabler/icons-react";

interface Suggestion {
  doctor: { name?: string; studioName?: string };
  user: { name: string; image?: string };
  details?: string;
  createdAt?: string;
}

const Suggestion = () => {
  const dispatch = useAppDispatch();
  const { doctorSuggestion, userSuggestion, doctorTotal, userTotal } = useSelector((state: RootStore) => state.suggestion);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [type, setType] = useState<string>("user");
  const [expandedRows, setExpandedRows] = useState<any>({});

  useEffect(() => {
    const payload = { type: type === "studio" ? 1 : 2, start: page, limit: rowsPerPage };
    type === "studio" ? dispatch(getDoctorSuggestion(payload)) : dispatch(getUserSuggestion(payload));
  }, [dispatch, type, page, rowsPerPage]);

  const toggleExpand = (index: number) => setExpandedRows((p: any) => ({ ...p, [index]: !p[index] }));
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };

  const studioColumns = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Studio",
      Cell: ({ row }: { row: Suggestion }) => (
        <span className="dt-badge dt-badge-indigo" style={{ textTransform: "capitalize" }}>
          {row?.doctor?.studioName || row?.doctor?.name || "—"}
        </span>
      ),
    },
    {
      Header: "Details",
      Cell: ({ row, index }: { row: Suggestion; index: number }) => {
        const text = row?.details || "—";
        const isExpanded = expandedRows[index];
        return (
          <span style={{ fontSize: 13, color: "#374151" }}>
            {isExpanded ? text : text.substring(0, 50)}
            {text.length > 50 && (
              <span onClick={() => toggleExpand(index)} style={{ color: "#6366F1", cursor: "pointer", fontWeight: 600, marginLeft: 4, fontSize: 12 }}>
                {isExpanded ? " Read less" : " Read more..."}
              </span>
            )}
          </span>
        );
      },
    },
    {
      Header: "Date",
      Cell: ({ row }: { row: Suggestion }) => (
        <span className="dt-badge dt-badge-gray">{row?.createdAt?.split("T")[0] || "—"}</span>
      ),
    },
  ];

  const userColumns = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "User",
      Cell: ({ row }: { row: Suggestion }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={row?.user?.image || `/images/user.jpg`} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", border: "2px solid #E5E7EB" }} alt="" />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#111827", textTransform: "capitalize" }}>{row?.user?.name || "—"}</span>
            {row?.user?.name && (
              <IconCopy size={13} style={{ cursor: "pointer", color: "#9CA3AF" }} onClick={() => copyToClipboard(row.user.name)} />
            )}
          </div>
        </div>
      ),
    },
    {
      Header: "Details",
      Cell: ({ row, index }: { row: Suggestion; index: number }) => {
        const text = row?.details || "—";
        const isExpanded = expandedRows[index];
        return (
          <span style={{ fontSize: 13, color: "#374151" }}>
            {isExpanded ? text : text.substring(0, 50)}
            {text.length > 50 && (
              <span onClick={() => toggleExpand(index)} style={{ color: "#6366F1", cursor: "pointer", fontWeight: 600, marginLeft: 4, fontSize: 12 }}>
                {isExpanded ? " Read less" : " Read more..."}
              </span>
            )}
          </span>
        );
      },
    },
    {
      Header: "Date",
      Cell: ({ row }: { row: Suggestion }) => (
        <span className="dt-badge dt-badge-gray">{row?.createdAt?.split("T")[0] || "—"}</span>
      ),
    },
  ];

  const tabs = [
    { key: "user",   label: "User Suggestions",   icon: <IconUser size={15} />,          total: userTotal },
    { key: "studio", label: "Studio Suggestions",  icon: <IconBuildingStore size={15} />, total: doctorTotal },
  ];

  return (
    <div className="dt-page">
      <div className="dt-toolbar">
        <div className="dt-tabs">
          {tabs.map((t) => (
            <button key={t.key} className={`dt-tab ${type === t.key ? "dt-tab-active" : ""}`} onClick={() => { setType(t.key); setPage(0); }}>
              {t.icon}
              {t.label}
              <span className="dt-count" style={{ marginLeft: 6 }}>{t.total ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dt-content">
        <Table
          type="server"
          data={type === "studio" ? doctorSuggestion : userSuggestion}
          mapData={type === "studio" ? studioColumns : userColumns}
          PerPage={rowsPerPage}
          Page={page}
        />
        <Pagination
          type="server"
          serverPage={page}
          setServerPage={setPage}
          serverPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalData={type === "studio" ? doctorTotal : userTotal}
        />
      </div>
    </div>
  );
};

Suggestion.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Suggestion;
