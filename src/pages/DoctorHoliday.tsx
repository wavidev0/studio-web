import RootLayout from "@/component/layout/Layout";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { deleteDoctorHoliday, getDoctorDropDown, getdoctorHoliday } from "@/store/doctorHolidaySlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { warningForText } from "@/utils/Alert";
import { IconTrash, IconCalendarOff, IconCalendar, IconBuildingStore } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface StudioHoliday {
  doctor: { name?: string; studioName?: string; image?: string; _id?: string };
  date?: string;
  reason?: string;
  _id?: string;
}

export const DoctorHoliday = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const doctorHoliday = useSelector((state: RootStore) => state.doctorHoliday);

  const [doctorId, setDoctorId] = useState<any>("All");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);

  useEffect(() => {
    dispatch(getdoctorHoliday(doctorId));
    dispatch(getDoctorDropDown());
  }, [dispatch, doctorId]);

  const handleDelete = (id: any) => {
    warningForText("Confirm Action", "Are you sure you want to delete this holiday request?")
      .then((r: any) => { if (r.isConfirmed) dispatch(deleteDoctorHoliday(id)); })
      .catch(console.log);
  };

  const handleInfo = (id: any) => router.push({ pathname: "/DoctorProfile", query: { id } });
  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };

  const columns = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Studio",
      Cell: ({ row }: { row: StudioHoliday }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => handleInfo(row?.doctor?._id)}>
          <img
            src={row?.doctor?.image || `/images/user.jpg`}
            style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "2px solid #E5E7EB", flexShrink: 0 }}
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
      Header: "Date",
      Cell: ({ row }: { row: StudioHoliday }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconCalendar size={14} color="#6366F1" />
          <span className="dt-badge dt-badge-indigo">{row?.date || "—"}</span>
        </div>
      ),
    },
    {
      Header: "Reason",
      Cell: ({ row }: { row: StudioHoliday }) => (
        <span style={{ fontSize: 13, color: "#374151" }}>{row?.reason || "—"}</span>
      ),
    },
    {
      Header: "Actions",
      Cell: ({ row }: { row: StudioHoliday }) => (
        <button className="act-icon act-red" title="Delete" onClick={() => handleDelete(row._id)}>
          <IconTrash size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="dt-page">
      <div className="dt-toolbar">
        <div className="dt-tabs">
          <button className="dt-tab dt-tab-active">
            <IconCalendarOff size={15} />
            Studio Holidays
            <span className="dt-count" style={{ marginLeft: 6 }}>
              {doctorHoliday?.doctorHoliday?.length ?? 0}
            </span>
          </button>
        </div>

        {/* Studio filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconBuildingStore size={16} color="#9CA3AF" />
          <select
            className="form-select"
            style={{ width: 200, fontSize: 13, borderRadius: 8 }}
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="All">All Studios</option>
            {doctorHoliday?.doctorDropDown?.map((item: any) => (
              <option key={item._id} value={item._id}>
                {item?.studioName || item?.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="dt-content">
        <Table
          data={doctorHoliday?.doctorHoliday}
          mapData={columns}
          PerPage={rowsPerPage}
          Page={page}
          type="client"
        />
        <Pagination
          type="client"
          serverPage={page}
          setServerPage={setPage}
          serverPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalData={doctorHoliday?.doctorHoliday?.length}
        />
      </div>
    </div>
  );
};

DoctorHoliday.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default DoctorHoliday;
