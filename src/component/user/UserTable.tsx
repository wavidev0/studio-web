import Pagination from "@/extra/Pagination";
import Searching from "@/extra/Searching";
import Table from "@/extra/Table";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { blockuser, getAllUser } from "@/store/userSlice";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  IconBell,
  IconClockCheck,
  IconInfoCircle,
  IconLock,
  IconLockOpen,
  IconMapPin,
  IconPhone,
  IconCalendar,
} from "@tabler/icons-react";
import { warning } from "@/utils/Alert";

interface UserData {
  _id: string;
  image: string;
  name: string;
  email: string;
  mobile: string;
  gender: string;
  uniqueId: number;
  isBlock: boolean;
  country: string;
}

interface Props {
  view?: "list" | "kanban";
}

const UserTable = ({ view = "list" }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, total } = useSelector((state: RootStore) => state.user);

  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("ALL");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    dispatch(getAllUser({ start: page, limit: rowsPerPage, search }));
  }, [dispatch, search, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };
  const handleFilterData = (value: any) => { if (typeof value === "string") { setPage(0); setSearch(value); } };

  const handleBlock = (row: UserData) => {
    const action = row.isBlock ? "Unblock" : "Block";
    warning(action).then((r: any) => {
      if (r.isConfirmed) dispatch(blockuser(row._id));
    }).catch(console.log);
  };

  const handleInfo = (id: any) => router.push({ pathname: "/UserProfile", query: { id } });
  const handleOpenBookings = (row: any) => router.push({ pathname: "/UserBooking", query: { id: row?._id, name: row?.name } });
  const handleNotify = (id: any) => dispatch(openDialog({ type: "notification", data: { id, type: "user" } }));

  const userTable = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "User",
      Cell: ({ row }: { row: UserData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => handleInfo(row._id)}>
          <img
            src={row?.image || `/images/user.jpg`}
            style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", border: "2px solid #E5E7EB", flexShrink: 0 }}
            alt=""
          />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{row?.name || "—"}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{row?.email || "—"}</div>
          </div>
        </div>
      ),
    },
    {
      Header: "Mobile",
      Cell: ({ row }: { row: UserData }) => (
        <span style={{ fontSize: 13, color: "#374151" }}>{row?.mobile || "—"}</span>
      ),
    },
    {
      Header: "Country",
      Cell: ({ row }: { row: UserData }) => (
        <span className="dt-badge dt-badge-gray">{row?.country || "—"}</span>
      ),
    },
    {
      Header: "Gender",
      Cell: ({ row }: { row: UserData }) => (
        <span className="dt-badge dt-badge-indigo" style={{ textTransform: "capitalize" }}>{row?.gender || "—"}</span>
      ),
    },
    {
      Header: "Status",
      Cell: ({ row }: { row: UserData }) => (
        <button
          className={`dt-status-pill ${row.isBlock ? "dt-status-blocked" : "dt-status-active"}`}
          onClick={() => handleBlock(row)}
          title={row.isBlock ? "Click to Unblock" : "Click to Block"}
        >
          {row.isBlock ? <IconLock size={12} /> : <IconLockOpen size={12} />}
          {row.isBlock ? "Blocked" : "Active"}
        </button>
      ),
    },
    {
      Header: "Actions",
      Cell: ({ row }: { row: UserData }) => (
        <div className="act-group">
          <button className="act-icon act-blue"   title="Bookings"     onClick={() => handleOpenBookings(row)}><IconClockCheck size={16} /></button>
          <button className="act-icon act-indigo" title="View Profile" onClick={() => handleInfo(row._id)}><IconInfoCircle size={16} /></button>
          <button className="act-icon act-amber"  title="Notify"       onClick={() => handleNotify(row._id)}><IconBell size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="dt-content">
      <div className="dt-content-header">
        <h5 className="dt-content-title">
          All Users
          <span className="dt-count">{total ?? 0}</span>
        </h5>
        <Searching
          type="server"
          data={user}
          setData={setData}
          column={userTable}
          serverSearching={handleFilterData}
        />
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <>
          <Table type="server" data={user} mapData={userTable} PerPage={rowsPerPage} Page={page} />
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

      {/* KANBAN VIEW */}
      {view === "kanban" && (
        <>
          <div className="kv-grid">
            {(user || []).map((row: UserData) => (
              <div key={row._id} className="kv-card">
                <div className="kv-cover" onClick={() => handleInfo(row._id)}>
                  <img
                    src={row?.image || `/images/user.jpg`}
                    alt={row?.name}
                    className="kv-cover-img"
                  />
                  <div className="kv-cover-overlay" />
                  <button
                    className={`kv-status ${row.isBlock ? "kv-status-blocked" : "kv-status-active"}`}
                    onClick={(e) => { e.stopPropagation(); handleBlock(row); }}
                  >
                    {row.isBlock ? <IconLock size={11} /> : <IconLockOpen size={11} />}
                    {row.isBlock ? "Blocked" : "Active"}
                  </button>
                  <div className="kv-price" style={{ textTransform: "capitalize" }}>
                    {row?.gender || "—"}
                  </div>
                </div>

                <div className="kv-body">
                  <h4 className="kv-name" onClick={() => handleInfo(row._id)}>{row?.name || "—"}</h4>
                  <p className="kv-owner">{row?.email || "—"}</p>
                  <div className="kv-meta">
                    <span className="kv-meta-item"><IconMapPin size={13} />{row?.country || "—"}</span>
                    <span className="kv-meta-item"><IconPhone size={13} />{row?.mobile || "—"}</span>
                  </div>
                </div>

                <div className="kv-footer">
                  <button className="act-icon act-blue"   title="Bookings"     onClick={() => handleOpenBookings(row)}><IconClockCheck size={15} /></button>
                  <button className="act-icon act-indigo" title="View Profile" onClick={() => handleInfo(row._id)}><IconInfoCircle size={15} /></button>
                  <button className="act-icon act-amber"  title="Notify"       onClick={() => handleNotify(row._id)}><IconBell size={15} /></button>
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

export default UserTable;
