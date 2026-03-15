import React, { useEffect, useState } from "react";
import RootLayout from "@/component/layout/Layout";
import { useSelector } from "react-redux";
import { RootStore, useAppDispatch } from "@/store/store";
import { getMonthlyReport } from "@/store/monthlyReportSlice";
import Table from "@/extra/Table";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Pagination from "@/extra/Pagination";
import { IconReportAnalytics, IconBuildingStore, IconCircleCheck, IconCurrencyDollar, IconWallet, IconPercentage, IconCalendar } from "@tabler/icons-react";

interface MonthlyReportData {
  amount?: number;
  completedAppointments?: number;
  doctorEarning?: number;
  doctors?: number;
  month?: string;
  tax?: number;
}

export default function MonthlyReport() {
  const thisYear = new Date();
  const { setting }: any = useSelector((state: RootStore) => state?.setting);
  const monthlyReport = useSelector((state: RootStore) => state?.monthlyReport);
  const dispatch = useAppDispatch();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(12);
  const [selectedDate, setSelectedDate] = useState<any>(thisYear);

  const cur = setting?.currencySymbol || "$";
  const formattedYear = moment(selectedDate).format("YYYY");

  useEffect(() => {
    dispatch(getMonthlyReport(formattedYear));
  }, [dispatch, formattedYear]);

  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };

  const paginatedData = monthlyReport?.monthlyReport?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const monthReportTable = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Month",
      Cell: ({ row }: { row: MonthlyReportData }) => (
        <span className="dt-badge dt-badge-indigo">{row?.month || "—"}</span>
      ),
    },
    {
      Header: "Studios",
      Cell: ({ row }: { row: MonthlyReportData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconBuildingStore size={14} color="#6366F1" />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#3730A3" }}>{row?.doctors ?? 0}</span>
        </div>
      ),
    },
    {
      Header: "Completed Bookings",
      Cell: ({ row }: { row: MonthlyReportData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconCircleCheck size={14} color="#10B981" />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#065F46" }}>{row?.completedAppointments ?? 0}</span>
        </div>
      ),
    },
    {
      Header: "Total Revenue",
      Cell: ({ row }: { row: MonthlyReportData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconCurrencyDollar size={14} color="#6366F1" />
          <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{cur}{row?.amount ?? 0}</span>
        </div>
      ),
    },
    {
      Header: "Studio Earning",
      Cell: ({ row }: { row: MonthlyReportData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconWallet size={14} color="#10B981" />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#065F46" }}>{cur}{row?.doctorEarning ?? 0}</span>
        </div>
      ),
    },
    {
      Header: "Tax (%)",
      Cell: ({ row }: { row: MonthlyReportData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconPercentage size={14} color="#F59E0B" />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#92400E" }}>{row?.tax ?? 0}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="dt-page">
      <div className="dt-toolbar">
        <div className="dt-tabs">
          <button className="dt-tab dt-tab-active">
            <IconReportAnalytics size={15} />
            Monthly Report
            <span className="dt-count" style={{ marginLeft: 6 }}>{monthlyReport?.monthlyReport?.length ?? 0}</span>
          </button>
        </div>

        {/* Year picker */}
        <div style={{ position: "relative" }}>
          <IconCalendar size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none", zIndex: 1 }} />
          <ReactDatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy"
            showYearPicker
            className="form-control"
            style={{ paddingLeft: 32, fontSize: 13, borderRadius: 8, width: 140 }}
          />
        </div>
      </div>

      <div className="dt-content">
        <Table type="client" data={paginatedData} mapData={monthReportTable} serverPerPage={rowsPerPage} Page={page} />
        <Pagination type="client" serverPage={page} setServerPage={setPage} serverPerPage={rowsPerPage}
          onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}
          totalData={monthlyReport?.monthlyReport?.length} />
      </div>
    </div>
  );
}

MonthlyReport.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
