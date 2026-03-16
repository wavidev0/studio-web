import React, { useEffect, useState } from "react";
import RootLayout from "@/component/layout/Layout";
import { useSelector } from "react-redux";
import { RootStore, useAppDispatch } from "@/store/store";
import { getDailyBooking } from "@/store/bookingSlice";
import Table from "@/extra/Table";
import Analytics from "@/extra/Analytic";
import Pagination from "@/extra/Pagination";
import { IconCalendarStats, IconBuildingStore, IconCurrencyDollar, IconPercentage, IconWallet } from "@tabler/icons-react";

interface DailyBookingData {
  date: string;
  doctor: number;
  totalAmount?: number;
  doctorEarning?: number;
  totalTax?: number;
  adminEarning?: number;
}

export default function DailyBooking() {
  const { setting }: any = useSelector((state: RootStore) => state?.setting);
  const { total, calendarData } = useSelector((state: RootStore) => state?.booking);
  const dispatch = useAppDispatch();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [startDate, setStartDate] = useState("ALL");
  const [endDate, setEndDate] = useState("ALL");

  const cur = setting?.currencySymbol || '₹';

  useEffect(() => {
    dispatch(getDailyBooking({ startDate, endDate, start: page, limit: rowsPerPage }));
  }, [dispatch, startDate, endDate, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };

  const dailyBookingTable = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Date",
      Cell: ({ row }: { row: DailyBookingData }) => (
        <span className="dt-badge dt-badge-gray">{row?.date || "—"}</span>
      ),
    },
    {
      Header: "Studios",
      Cell: ({ row }: { row: DailyBookingData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconBuildingStore size={14} color="#6366F1" />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#3730A3" }}>{row?.doctor ?? 0}</span>
        </div>
      ),
    },
    {
      Header: `Studio Earning`,
      Cell: ({ row }: { row: DailyBookingData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconWallet size={14} color="#10B981" />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#065F46" }}>{cur}{row?.doctorEarning ?? 0}</span>
        </div>
      ),
    },
    {
      Header: "Tax (%)",
      Cell: ({ row }: { row: DailyBookingData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconPercentage size={14} color="#F59E0B" />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#92400E" }}>{row?.totalTax ?? 0}%</span>
        </div>
      ),
    },
    {
      Header: "Admin Earning",
      Cell: ({ row }: { row: DailyBookingData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconCurrencyDollar size={14} color="#6366F1" />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#3730A3" }}>{cur}{row?.adminEarning ?? 0}</span>
        </div>
      ),
    },
    {
      Header: "Total Revenue",
      Cell: ({ row }: { row: DailyBookingData }) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: "#111827", background: "#F0FDF4", padding: "4px 10px", borderRadius: 20 }}>
          {cur}{row?.totalAmount ?? 0}
        </span>
      ),
    },
  ];

  return (
    <div className="dt-page">
      <div className="dt-toolbar">
        <div className="dt-tabs">
          <button className="dt-tab dt-tab-active">
            <IconCalendarStats size={15} />
            Daily Bookings
            <span className="dt-count" style={{ marginLeft: 6 }}>{total ?? 0}</span>
          </button>
        </div>
        <Analytics analyticsStartDate={startDate} analyticsStartEnd={endDate} analyticsStartDateSet={setStartDate} analyticsStartEndSet={setEndDate} />
      </div>

      <div className="dt-content">
        <Table type="server" data={calendarData} mapData={dailyBookingTable} serverPerPage={rowsPerPage} Page={page} />
        <Pagination type="server" serverPage={page} setServerPage={setPage} serverPerPage={rowsPerPage}
          onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} totalData={total} />
      </div>
    </div>
  );
}

DailyBooking.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
