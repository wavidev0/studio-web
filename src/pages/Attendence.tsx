import RootLayout from "@/component/layout/Layout";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getAttendence, getDoctorDropDown } from "@/store/attendenceSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { IconCalendar, IconBuildingStore, IconCircleCheck, IconCircleX, IconClockHour4 } from "@tabler/icons-react";

const Attendence = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { attendence, doctorDropDown } = useSelector((state: RootStore) => state.attendence);

  const thisMonth: any = new Date();
  thisMonth.setDate(1);

  const [selectedDate, setSelectedDate] = useState<any>(thisMonth);
  const [doctorId, setDoctorId] = useState<any>("ALL");
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const month = moment(selectedDate).format("YYYY-MM");
    dispatch(getAttendence({ doctorId, month }));
    dispatch(getDoctorDropDown());
  }, [dispatch, selectedDate, doctorId]);

  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };
  const handleInfo = (id: any) => router.push({ pathname: "/DoctorProfile", query: { id } });

  const handleDateChange = (e: any) => {
    const date = e.target.value;
    setSelectedDate(date ? moment(date, "YYYY-MM").toDate() : thisMonth);
  };

  const attendenceTable = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Studio",
      Cell: ({ row }: { row: any }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => handleInfo(row?.doctor?._id)}>
          <img
            src={row?.doctor?.image || `/images/user.jpg`}
            style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", border: "2px solid #E5E7EB", flexShrink: 0 }}
            alt=""
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
              {row?.doctor?.studioName || row?.doctor?.name || "—"}
            </div>
            {row?.doctor?.studioName && (
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{row?.doctor?.name}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      Header: "Month",
      Cell: ({ row }: { row: any }) => (
        <span className="dt-badge dt-badge-gray">{row?.month || "—"}</span>
      ),
    },
    {
      Header: "Available Days",
      Cell: ({ row }: { row: any }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconCircleCheck size={15} color="#10B981" />
          <span style={{ fontWeight: 600, color: "#065F46", fontSize: 13 }}>{row?.attendCount ?? 0}</span>
        </div>
      ),
    },
    {
      Header: "Absent Days",
      Cell: ({ row }: { row: any }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconCircleX size={15} color="#EF4444" />
          <span style={{ fontWeight: 600, color: "#991B1B", fontSize: 13 }}>{row?.absentCount ?? 0}</span>
        </div>
      ),
    },
    {
      Header: "Total Days",
      Cell: ({ row }: { row: any }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconClockHour4 size={15} color="#6366F1" />
          <span style={{ fontWeight: 600, color: "#3730A3", fontSize: 13 }}>{row?.totalDays ?? 0}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="dt-page">
      {/* Toolbar */}
      <div className="dt-toolbar">
        <div className="dt-tabs">
          <button className="dt-tab dt-tab-active">
            <IconBuildingStore size={15} />
            Studio Attendance
            <span className="dt-count" style={{ marginLeft: 6 }}>{attendence?.length ?? 0}</span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Studio filter */}
          <select
            className="form-select"
            style={{ width: 180, fontSize: 13, borderRadius: 8 }}
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="ALL">All Studios</option>
            {doctorDropDown?.map((item: any) => (
              <option key={item._id} value={item._id}>
                {item?.studioName || item?.name}
              </option>
            ))}
          </select>

          {/* Month picker */}
          <div style={{ position: "relative" }}>
            <IconCalendar size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
            <input
              type="month"
              className="form-control"
              style={{ paddingLeft: 32, fontSize: 13, borderRadius: 8, width: 170 }}
              value={moment(selectedDate).format("YYYY-MM")}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="dt-content">
        <Table data={attendence} mapData={attendenceTable} PerPage={rowsPerPage} Page={page} type="client" />
        <Pagination
          type="client"
          serverPage={page}
          setServerPage={setPage}
          serverPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalData={attendence?.length}
        />
      </div>
    </div>
  );
};

Attendence.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Attendence;
