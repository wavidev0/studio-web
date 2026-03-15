import React, { useEffect, useState } from "react";
import RootLayout from "../component/layout/Layout";
import { useAppDispatch } from "@/store/store";
import { getRechargeRequest } from "../store/rechargeSlice";
import { useSelector } from "react-redux";
import Table from "@/extra/Table";
import Pagination from "@/extra/Pagination";
import Analytics from "@/extra/Analytic";
import { useRouter } from "next/router";
import { IconCopy, IconWallet, IconCalendar, IconClockHour4 } from "@tabler/icons-react";

interface RechargeRow {
  _id?: string;
  user?: { name: string; image?: string; _id: string };
  type?: number;
  date?: string;
  amount?: any;
  paymentGateway?: any;
  time?: string;
  uniqueId?: any;
  couponId?: any;
  couponAmount?: any;
}

interface RootStore {
  setting: any;
  recharge: { recharge: any; total: number };
}

const gatewayLabel = (g: any) => g === 1 ? "Razorpay" : g === 2 ? "Stripe" : g === 3 ? "Flutter" : "—";

const txConfig: any = {
  1: { label: "Wallet Deposit",       bg: "#D1FAE5", color: "#065F46" },
  2: { label: "Booking Fee Deduction", bg: "#FEE2E2", color: "#991B1B" },
  3: { label: "Booking Fee Refund",    bg: "#DBEAFE", color: "#1E40AF" },
};

const statusTabs = [
  { label: "All",    value: "ALL" },
  { label: "Debit",  value: "1" },
  { label: "Credit", value: "2" },
];

const Recharge = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { recharge } = useSelector((state: RootStore) => state.recharge);
  const { setting } = useSelector((state: RootStore) => state.setting);

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [startDate, setStartDate] = useState("ALL");
  const [endDate, setEndDate] = useState("ALL");
  const [status, setStatus] = useState<string>("ALL");

  const cur = setting?.currencySymbol || "$";

  useEffect(() => {
    dispatch(getRechargeRequest({ startDate, endDate, status }));
  }, [dispatch, startDate, endDate, status]);

  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };
  const copyToClipboard = (text: any) => navigator.clipboard.writeText(text);

  const rechargeTable = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "User",
      Cell: ({ row }: { row: RechargeRow }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => router.push({ pathname: "/UserProfile", query: { id: row?.user?._id } })}>
          <img
            src={row?.user?.image || `/images/user.jpg`}
            style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "2px solid #E5E7EB", flexShrink: 0 }}
            alt=""
          />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#111827", textTransform: "capitalize" }}>
            {row?.user?.name || "—"}
          </span>
        </div>
      ),
    },
    {
      Header: "Unique ID",
      Cell: ({ row }: { row: RechargeRow }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151" }}>
          {row?.uniqueId || "—"}
          {row?.uniqueId && (
            <IconCopy size={13} style={{ cursor: "pointer", color: "#9CA3AF" }}
              onClick={() => copyToClipboard(row.uniqueId)} />
          )}
        </span>
      ),
    },
    {
      Header: "Date & Time",
      Cell: ({ row }: { row: RechargeRow }) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#374151" }}>
            <IconCalendar size={12} color="#9CA3AF" />{row?.date || "—"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
            <IconClockHour4 size={12} />{row?.time || "—"}
          </div>
        </div>
      ),
    },
    {
      Header: "Gateway",
      Cell: ({ row }: { row: RechargeRow }) => (
        <span className="dt-badge dt-badge-gray">{gatewayLabel(row?.paymentGateway)}</span>
      ),
    },
    {
      Header: "Amount",
      Cell: ({ row }: { row: RechargeRow }) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{cur}{row?.amount ?? "—"}</span>
      ),
    },
    {
      Header: "Type",
      Cell: ({ row }: { row: RechargeRow }) => (
        <span style={{
          background: row?.type === 2 ? "#FEE2E2" : "#D1FAE5",
          color: row?.type === 2 ? "#991B1B" : "#065F46",
          borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600,
        }}>
          {row?.type === 2 ? "Debit" : "Credit"}
        </span>
      ),
    },
    {
      Header: "Description",
      Cell: ({ row }: { row: RechargeRow }) => {
        const cfg = txConfig[row?.type];
        if (!cfg) return <span>—</span>;
        return (
          <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>
            {cfg.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="dt-page">
      <div className="dt-toolbar">
        <div className="dt-tabs">
          {statusTabs.map((t) => (
            <button
              key={t.value}
              className={`dt-tab ${status === t.value ? "dt-tab-active" : ""}`}
              onClick={() => { setStatus(t.value); setPage(0); }}
            >
              {t.value === "ALL" && <IconWallet size={14} />}
              {t.label}
              {t.value === "ALL" && (
                <span className="dt-count" style={{ marginLeft: 6 }}>{recharge?.length ?? 0}</span>
              )}
            </button>
          ))}
        </div>
        <Analytics
          analyticsStartDate={startDate}
          analyticsStartEnd={endDate}
          analyticsStartDateSet={setStartDate}
          analyticsStartEndSet={setEndDate}
        />
      </div>

      <div className="dt-content">
        <Table type="client" data={recharge} mapData={rechargeTable} PerPage={rowsPerPage} Page={page} />
        <Pagination
          type="client"
          serverPage={page}
          setServerPage={setPage}
          serverPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalData={recharge?.length}
        />
      </div>
    </div>
  );
};

Recharge.getLayout = function getLayout(page: any) {
  return <RootLayout>{page}</RootLayout>;
};

export default Recharge;
