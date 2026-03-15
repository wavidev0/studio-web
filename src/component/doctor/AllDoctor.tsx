import Searching from "@/extra/Searching";
import Table from "@/extra/Table";
import React, { useEffect, useState } from "react";
import { openDialog } from "@/store/dialogSlice";
import ToggleSwitch from "@/extra/TogggleSwitch";
import { blockDoctor, deleteDoctor, getAllDoctor } from "@/store/doctorSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { warning } from "@/utils/Alert";
import Pagination from "@/extra/Pagination";
import {
  IconClockCheck,
  IconEdit,
  IconInfoCircle,
  IconMoneybag,
  IconTrash,
  IconMapPin,
  IconPhone,
  IconCurrencyDollar,
  IconCalendar,
  IconLock,
  IconLockOpen,
} from "@tabler/icons-react";
import LazyImage from "@/extra/ImageFallback";

interface DoctorData {
  _id: string;
  image: string;
  name: string;
  mobile: number;
  charge: number;
  country: string;
  studioName: string;
  isBlock: boolean;
  bookingCount?: number;
}

interface Props {
  view?: "list" | "kanban";
}

const AllDoctor = ({ view = "list" }: Props) => {
  const { setting }: any = useSelector((state: RootStore) => state?.setting);
  const { doctor, total } = useSelector((state: RootStore) => state.doctor);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("ALL");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  const cur = setting?.currencySymbol || "$";

  useEffect(() => {
    dispatch(getAllDoctor({ start: page, limit: rowsPerPage, search }));
  }, [dispatch, search, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };
  const handleFilterData = (value: any) => { if (typeof value === "string") { setPage(0); setSearch(value); } };

  // ── Block/Unblock with confirmation alert ──────────────────────────────────
  const handleSettingSwitch = (row: DoctorData) => {
    const action = row.isBlock ? "Unblock" : "Block";
    warning(action).then((r: any) => {
      if (r.isConfirmed) dispatch(blockDoctor(row._id));
    }).catch(console.log);
  };

  const handleInfo = (id: any) => router.push({ pathname: "/DoctorProfile", query: { id } });
  const handleEarning = (id: any) => router.push({ pathname: "/doctor/DoctorEarning", query: { id } });
  const handleOpenBookings = (row: any) => router.push({ pathname: "/doctor/DoctorBooking", query: { id: row?._id, drName: row?.name } });
  const handleDelete = (id: any) => {
    warning("Delete").then((r: any) => { if (r.isConfirmed) dispatch(deleteDoctor(id)); }).catch(console.log);
  };

  const doctorTable = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Studio",
      Cell: ({ row }: { row: DoctorData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => handleInfo(row._id)}>
          <img
            src={row?.image || `/images/user.jpg`}
            style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", border: "2px solid #E5E7EB", flexShrink: 0 }}
            alt=""
          />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{row?.studioName || "—"}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{row?.name}</div>
          </div>
        </div>
      ),
    },
    {
      Header: "Mobile",
      Cell: ({ row }: { row: DoctorData }) => (
        <span style={{ fontSize: 13, color: "#374151" }}>{row?.mobile || "—"}</span>
      ),
    },
    {
      Header: "City",
      Cell: ({ row }: { row: DoctorData }) => (
        <span className="dt-badge dt-badge-gray">{row?.country || "—"}</span>
      ),
    },
    {
      Header: `Price/Hr`,
      body: "charge",
      sorting: { type: "client" },
      Cell: ({ row }: { row: DoctorData }) => (
        <span className="dt-badge dt-badge-indigo">{cur}{row?.charge}/hr</span>
      ),
    },
    {
      Header: "Bookings",
      Cell: ({ row }: { row: any }) => (
        <span className="dt-badge dt-badge-blue">{row?.bookingCount ?? 0}</span>
      ),
    },
    {
      Header: "Status",
      body: "isBlock",
      sorting: { type: "client" },
      Cell: ({ row }: { row: DoctorData }) => (
        <button
          className={`dt-status-pill ${row.isBlock ? "dt-status-blocked" : "dt-status-active"}`}
          onClick={() => handleSettingSwitch(row)}
          title={row.isBlock ? "Click to Unblock" : "Click to Block"}
        >
          {row.isBlock ? <IconLock size={12} /> : <IconLockOpen size={12} />}
          {row.isBlock ? "Blocked" : "Active"}
        </button>
      ),
    },
    {
      Header: "Actions",
      Cell: ({ row }: { row: DoctorData }) => (
        <div className="act-group">
          <button className="act-icon act-blue"   title="Bookings" onClick={() => handleOpenBookings(row)}><IconClockCheck size={16} /></button>
          <button className="act-icon act-indigo" title="View"     onClick={() => handleInfo(row._id)}><IconInfoCircle size={16} /></button>
          <button className="act-icon act-green"  title="Earnings" onClick={() => handleEarning(row._id)}><IconMoneybag size={16} /></button>
          <button className="act-icon act-amber"  title="Edit"     onClick={() => dispatch(openDialog({ type: "doctor", data: row }))}><IconEdit size={16} /></button>
          <button className="act-icon act-red"    title="Delete"   onClick={() => handleDelete(row?._id)}><IconTrash size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="dt-content">
      <div className="dt-content-header">
        <h5 className="dt-content-title">
          All Studios
          <span className="dt-count">{total ?? 0}</span>
        </h5>
        <Searching
          type="server"
          data={doctor}
          setData={setData}
          column={doctorTable}
          serverSearching={handleFilterData}
        />
      </div>

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <>
          <Table type="server" data={doctor} mapData={doctorTable} PerPage={rowsPerPage} Page={page} />
          <Pagination
            type="server"
            serverPage={page}
            setServerPage={setPage}
            serverPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            totalData={total}
          />
        </>
      )}

      {/* ── KANBAN VIEW ── */}
      {view === "kanban" && (
        <>
          <div className="kv-grid">
            {(doctor || []).map((row: DoctorData) => (
              <div key={row._id} className="kv-card">

                {/* Cover image */}
                <div className="kv-cover" onClick={() => handleInfo(row._id)}>
                  <img
                    src={row?.image || `/images/user.jpg`}
                    alt={row?.studioName}
                    className="kv-cover-img"
                  />
                  {/* gradient overlay */}
                  <div className="kv-cover-overlay" />

                  {/* status badge top-right */}
                  <button
                    className={`kv-status ${row.isBlock ? "kv-status-blocked" : "kv-status-active"}`}
                    onClick={(e) => { e.stopPropagation(); handleSettingSwitch(row); }}
                  >
                    {row.isBlock ? <IconLock size={11} /> : <IconLockOpen size={11} />}
                    {row.isBlock ? "Blocked" : "Active"}
                  </button>

                  {/* price badge bottom-left */}
                  <div className="kv-price">
                    {cur}{row?.charge}<span>/hr</span>
                  </div>
                </div>

                {/* Body */}
                <div className="kv-body">
                  <h4 className="kv-name" onClick={() => handleInfo(row._id)}>
                    {row?.studioName || row?.name || "—"}
                  </h4>
                  <p className="kv-owner">{row?.name}</p>

                  <div className="kv-meta">
                    <span className="kv-meta-item">
                      <IconMapPin size={13} />{row?.country || "—"}
                    </span>
                    <span className="kv-meta-item">
                      <IconCalendar size={13} />{row?.bookingCount ?? 0} bookings
                    </span>
                    <span className="kv-meta-item">
                      <IconPhone size={13} />{row?.mobile || "—"}
                    </span>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="kv-footer">
                  <button className="act-icon act-blue"   title="Bookings" onClick={() => handleOpenBookings(row)}><IconClockCheck size={15} /></button>
                  <button className="act-icon act-indigo" title="View"     onClick={() => handleInfo(row._id)}><IconInfoCircle size={15} /></button>
                  <button className="act-icon act-green"  title="Earnings" onClick={() => handleEarning(row._id)}><IconMoneybag size={15} /></button>
                  <button className="act-icon act-amber"  title="Edit"     onClick={() => dispatch(openDialog({ type: "doctor", data: row }))}><IconEdit size={15} /></button>
                  <button className="act-icon act-red"    title="Delete"   onClick={() => handleDelete(row?._id)}><IconTrash size={15} /></button>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            type="server"
            serverPage={page}
            setServerPage={setPage}
            serverPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            totalData={total}
          />
        </>
      )}
    </div>
  );
};

export default AllDoctor;
