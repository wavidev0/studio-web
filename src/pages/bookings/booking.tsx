import CancelBooking from "@/component/booking/CancelBooking";
import CompletedBooking from "@/component/booking/CompletedBooking";
import ConfirmBooking from "@/component/booking/ConfirmBooking";
import PendingBookingDialog from "@/component/booking/PendingBookingDialog";
import RootLayout from "@/component/layout/Layout";
import Analytics from "@/extra/Analytic";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getAllBookings } from "@/store/bookingSlice";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { IconCopy, IconCalendar, IconClockHour4 } from "@tabler/icons-react";

interface BookingData {
  _id: any;
  time: string;
  amount: number;
  user: { name: string; image: string; _id: string };
  date: string;
  appointmentId: any;
  doctor: { name: string; studioName: string; _id: string; image: string };
  service: string;
  status: number;
}

const statusConfig: any = {
  1: { label: "Pending",   bg: "#FEF3C7", color: "#92400E" },
  2: { label: "Confirmed", bg: "#DBEAFE", color: "#1E40AF" },
  3: { label: "Completed", bg: "#D1FAE5", color: "#065F46" },
  4: { label: "Cancelled", bg: "#FEE2E2", color: "#991B1B" },
};

const Booking = () => {
  const { setting }: any = useSelector((state: RootStore) => state?.setting);
  const booking = useSelector((state: RootStore) => state?.booking);
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [startDate, setStartDate] = useState("ALL");
  const [endDate, setEndDate] = useState("ALL");
  const [status, setStatus] = useState<string>("ALL");

  const cur = setting?.currencySymbol || "$";

  useEffect(() => {
    dispatch(getAllBookings({ startDate, endDate, status, start: page, limit: rowsPerPage }));
  }, [dispatch, startDate, endDate, page, rowsPerPage, status]);

  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const statusTabs = [
    { label: "All",       value: "ALL" },
    { label: "Pending",   value: "1" },
    { label: "Confirmed", value: "2" },
    { label: "Completed", value: "3" },
    { label: "Cancelled", value: "4" },
  ];

  const bookingTable = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "User",
      Cell: ({ row }: { row: BookingData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => router.push({ pathname: "/UserProfile", query: { id: row?.user?._id } })}>
          <img src={row?.user?.image || `/images/user.jpg`}
            style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "2px solid #E5E7EB", flexShrink: 0 }} alt="" />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#111827", textTransform: "capitalize" }}>{row?.user?.name || "—"}</span>
        </div>
      ),
    },
    {
      Header: "Studio",
      Cell: ({ row }: { row: BookingData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => router.push(`/DoctorProfile?id=${row?.doctor?._id}`)}>
          <img src={row?.doctor?.image || `/images/user.jpg`}
            style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "2px solid #E5E7EB", flexShrink: 0 }} alt="" />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#111827", textTransform: "capitalize" }}>
            {row?.doctor?.studioName || row?.doctor?.name || "—"}
          </span>
        </div>
      ),
    },
    {
      Header: "Service",
      Cell: ({ row }: { row: BookingData }) => (
        <span className="dt-badge dt-badge-indigo">{row?.service || "—"}</span>
      ),
    },
    {
      Header: "Booking ID",
      Cell: ({ row }: { row: BookingData }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151" }}>
          {row?.appointmentId || "—"}
          {row?.appointmentId && <IconCopy size={13} style={{ cursor: "pointer", color: "#9CA3AF" }} onClick={() => copyToClipboard(row.appointmentId)} />}
        </span>
      ),
    },
    {
      Header: `Amount`,
      Cell: ({ row }: { row: BookingData }) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{cur}{row?.amount ?? "—"}</span>
      ),
    },
    {
      Header: "Time & Date",
      Cell: ({ row }: { row: BookingData }) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#374151" }}>
            <IconClockHour4 size={13} color="#6366F1" />{row?.time || "—"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
            <IconCalendar size={12} />{row?.date || "—"}
          </div>
        </div>
      ),
    },
    {
      Header: "Status",
      Cell: ({ row }: { row: BookingData }) => {
        const cfg = statusConfig[row?.status];
        if (!cfg) return null;
        const handlers: any = { 1: () => dispatch(openDialog({ type: "pending", data: row })), 2: () => dispatch(openDialog({ type: "confirm", data: row })), 3: () => dispatch(openDialog({ type: "completed", data: row })), 4: () => dispatch(openDialog({ type: "cancel", data: row })) };
        return (
          <button onClick={handlers[row.status]}
            style={{ background: cfg.bg, color: cfg.color, border: "none", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {cfg.label}
          </button>
        );
      },
    },
  ];

  return (
    <div className="dt-page">
      <div className="dt-toolbar">
        {/* Status pill tabs */}
        <div className="dt-tabs">
          {statusTabs.map((t) => (
            <button key={t.value} className={`dt-tab ${status === t.value ? "dt-tab-active" : ""}`}
              onClick={() => { setStatus(t.value); setPage(0); }}>
              {t.label}
              {t.value === "ALL" && <span className="dt-count" style={{ marginLeft: 6 }}>{booking?.total ?? 0}</span>}
            </button>
          ))}
        </div>
        {/* Date filter */}
        <Analytics analyticsStartDate={startDate} analyticsStartEnd={endDate} analyticsStartDateSet={setStartDate} analyticsStartEndSet={setEndDate} />
      </div>

      <div className="dt-content">
        <Table type="server" data={booking?.booking} mapData={bookingTable} serverPerPage={rowsPerPage} Page={page} />
        <Pagination type="server" serverPage={page} setServerPage={setPage} serverPerPage={rowsPerPage}
          onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} totalData={booking?.total} />
      </div>

      {dialogueType === "pending" ? <PendingBookingDialog /> :
        dialogueType === "cancel" ? <CancelBooking /> :
        dialogueType === "completed" ? <CompletedBooking /> :
        dialogueType === "confirm" && <ConfirmBooking />}
    </div>
  );
};

Booking.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Booking;
