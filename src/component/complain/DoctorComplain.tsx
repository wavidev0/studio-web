import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserComplainDialog from "./UserComplainDialog";
import { deleteDoctorPendingComplain, deleteDoctorSolveComplain, getDoctorPendingComplain, getDoctorSolvedComplain } from "@/store/complainSlice";
import { warning } from "@/utils/Alert";
import { IconInfoCircle, IconTrash, IconCopy, IconClock, IconCircleCheck } from "@tabler/icons-react";

interface ComplainRow {
  _id: string;
  user: any;
  doctor: any;
  appointmentId: string;
  details: string;
  createdAt: string;
}

const DoctorComplain = () => {
  const dispatch = useAppDispatch();
  const { doctorPendingComplain, doctorSolvedComplain, total } = useSelector((state: RootStore) => state.complain);
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);

  const [type, setType] = useState<string>("pending");
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [page, setPage] = useState<number>(0);
  const [expandedRows, setExpandedRows] = useState<any>({});

  useEffect(() => {
    const payload = { start: page, limit: rowsPerPage };
    type === "pending" ? dispatch(getDoctorPendingComplain(payload)) : dispatch(getDoctorSolvedComplain(payload));
  }, [dispatch, type, page, rowsPerPage]);

  const toggleExpand = (index: number) => setExpandedRows((p: any) => ({ ...p, [index]: !p[index] }));
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };

  const handleDelete = (id: string) => {
    warning("Delete").then((r: any) => {
      if (r.isConfirmed) type === "pending" ? dispatch(deleteDoctorPendingComplain(id)) : dispatch(deleteDoctorSolveComplain(id));
    }).catch(console.log);
  };

  const columns = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Studio",
      Cell: ({ row }: { row: ComplainRow }) => (
        <span className="dt-badge dt-badge-indigo" style={{ textTransform: "capitalize" }}>
          {row?.doctor?.studioName || row?.doctor?.name || "—"}
        </span>
      ),
    },
    {
      Header: "Booking ID",
      Cell: ({ row }: { row: ComplainRow }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          {row?.appointmentId || "—"}
          {row?.appointmentId && (
            <IconCopy size={13} style={{ cursor: "pointer", color: "#9CA3AF" }} onClick={() => copyToClipboard(row.appointmentId)} />
          )}
        </span>
      ),
    },
    {
      Header: "Description",
      Cell: ({ row, index }: { row: ComplainRow; index: number }) => {
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
      Cell: ({ row }: { row: ComplainRow }) => (
        <span className="dt-badge dt-badge-gray">{row?.createdAt?.split("T")[0] || "—"}</span>
      ),
    },
    {
      Header: "Actions",
      Cell: ({ row }: { row: ComplainRow }) => (
        <div className="act-group">
          {type === "pending" && (
            <button className="act-icon act-indigo" title="View" onClick={() => dispatch(openDialog({ type: "doctorpendingcomplain", data: row }))}>
              <IconInfoCircle size={15} />
            </button>
          )}
          <button className="act-icon act-red" title="Delete" onClick={() => handleDelete(row._id)}>
            <IconTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  const tabs = [
    { key: "pending", label: "Pending", icon: <IconClock size={14} /> },
    { key: "solved",  label: "Solved",  icon: <IconCircleCheck size={14} /> },
  ];

  return (
    <div className="dt-content">
      {dialogueType === "doctorpendingcomplain" && <UserComplainDialog />}
      <div className="dt-content-header">
        <div className="dt-tabs" style={{ background: "#F9FAFB", borderRadius: 8, padding: 4 }}>
          {tabs.map((t) => (
            <button key={t.key} className={`dt-tab ${type === t.key ? "dt-tab-active" : ""}`} onClick={() => { setType(t.key); setPage(0); }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
        <span className="dt-count">{total ?? 0}</span>
      </div>
      <Table type="server" data={type === "pending" ? doctorPendingComplain : doctorSolvedComplain} mapData={columns} PerPage={rowsPerPage} Page={page} />
      <Pagination type="server" serverPage={page} setServerPage={setPage} serverPerPage={rowsPerPage} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} totalData={total} />
    </div>
  );
};

export default DoctorComplain;
