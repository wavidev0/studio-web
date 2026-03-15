import RootLayout from "@/component/layout/Layout";
import WithdrawDialog from "@/component/withdrawal/WithdrawDialog";
import WithdrawReasonDialog from "@/component/withdrawal/WithdrawReasonDialog";
import Analytics from "@/extra/Analytic";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { getWithdrawalRequest, withdrawRequestPayUpdate } from "@/store/withdrawalSlice";
import { IconCircleCheck, IconCircleX, IconInfoCircle, IconWallet, IconCalendar } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Withdrawal {
  doctor: { name?: string; studioName?: string; image?: string; _id?: string };
  createdAt?: string;
  amount?: any;
  _id?: any;
  status?: any;
}

const statusConfig: any = {
  1: { label: "Pending",  bg: "#FEF3C7", color: "#92400E" },
  2: { label: "Paid",     bg: "#D1FAE5", color: "#065F46" },
  3: { label: "Declined", bg: "#FEE2E2", color: "#991B1B" },
};

const statusTabs = [
  { label: "All",      value: "ALL" },
  { label: "Pending",  value: "1" },
  { label: "Paid",     value: "2" },
  { label: "Declined", value: "3" },
];

export default function Withdrawal() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { setting }: any = useSelector((state: RootStore) => state?.setting);
  const withdrawal = useSelector((state: RootStore) => state.withdraw);
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [status, setStatus] = useState<any>("ALL");
  const [startDate, setStartDate] = useState("ALL");
  const [endDate, setEndDate] = useState("ALL");

  const cur = setting?.currencySymbol || "$";

  useEffect(() => {
    dispatch(getWithdrawalRequest({ status, startDate, endDate }));
  }, [dispatch, status, startDate, endDate]);

  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };
  const handleInfo = (id: any) => router.push({ pathname: "/DoctorProfile", query: { id } });

  const WithDrawalTable = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Studio",
      Cell: ({ row }: { row: Withdrawal }) => (
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
      Header: "Amount",
      Cell: ({ row }: { row: Withdrawal }) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{cur}{row?.amount ?? "—"}</span>
      ),
    },
    {
      Header: "Date",
      Cell: ({ row }: { row: Withdrawal }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
          <IconCalendar size={13} color="#9CA3AF" />
          {row?.createdAt?.split("T")[0] || "—"}
        </div>
      ),
    },
    {
      Header: "Status",
      Cell: ({ row }: { row: Withdrawal }) => {
        const cfg = statusConfig[row?.status];
        if (!cfg) return null;
        return (
          <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      Header: "Actions",
      Cell: ({ row }: { row: Withdrawal }) => (
        <div className="act-group">
          <button className="act-icon act-indigo" title="View Details"
            onClick={() => dispatch(openDialog({ type: "withdrawal", data: row }))}>
            <IconInfoCircle size={15} />
          </button>
          {row?.status === 1 && (
            <>
              <button className="act-icon act-blue" title="Mark as Paid"
                onClick={() => dispatch(withdrawRequestPayUpdate(row._id))}>
                <IconCircleCheck size={15} />
              </button>
              <button className="act-icon act-red" title="Decline"
                onClick={() => dispatch(openDialog({ type: "reason", data: row }))}>
                <IconCircleX size={15} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="dt-page">
      {/* Toolbar with status tabs */}
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
                <span className="dt-count" style={{ marginLeft: 6 }}>{withdrawal?.withDrawal?.length ?? 0}</span>
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
        <Table
          data={withdrawal?.withDrawal}
          mapData={WithDrawalTable}
          PerPage={rowsPerPage}
          Page={page}
          type="client"
        />
        <Pagination
          type="server"
          serverPage={page}
          setServerPage={setPage}
          serverPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalData={withdrawal?.withDrawal?.length}
        />
      </div>

      {dialogueType === "withdrawal" ? <WithdrawDialog /> : dialogueType === "reason" && <WithdrawReasonDialog />}
    </div>
  );
}

Withdrawal.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
