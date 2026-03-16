import CancelBooking from "@/component/booking/CancelBooking";
import CompletedBooking from "@/component/booking/CompletedBooking";
import ConfirmBooking from "@/component/booking/ConfirmBooking";
import PendingBookingDialog from "@/component/booking/PendingBookingDialog";
import RootLayout from "@/component/layout/Layout";
import Table from "@/extra/Table";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { getUserAppointment } from "@/store/userSlice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "@/extra/Pagination";
import Analytics from "@/extra/Analytic";
import LazyImage from "@/extra/ImageFallback";
import Button from "@/extra/Button";
import { IconChevronLeft, IconCopy } from "@tabler/icons-react";

interface userBookingData {
  _id: any;
  time: string;
  amount: number;
  user: { name: string };
  date: string;
  appointmentId: any;
  doctor: [{ name: string; image: string; studioName: string }];
  service: string;
  status: number;
}

export default function UserBooking() {
  const dispatch = useAppDispatch();
  const { booking, total } = useSelector((state: RootStore) => state?.user);
  const { setting }: any = useSelector((state: RootStore) => state?.setting);
  const [startDate, setStartDate] = useState("ALL");
  const [endDate, setEndDate] = useState("ALL");
  const [status, setStatus] = useState<string>("ALL");
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);
  const [page, setPage] = useState<any>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const router = useRouter();
  const id: any = router?.query?.id;
  const name: any = router?.query?.name;

  useEffect(() => {
    let payload: any = {
      id: id,
      start: page,
      limit: rowsPerPage,
      startDate: startDate,
      endDate: endDate,
      status: status,
    };
    dispatch(getUserAppointment(payload));
  }, [dispatch, id, page, rowsPerPage, startDate, endDate, status]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const bookingType = [
    { name: "ALL", value: "ALL" },
    { name: "Pending", value: 1 },
    { name: "Confirm", value: 2 },
    { name: "Completed", value: 3 },
    { name: "Cancelled", value: 4 },
  ];
  const handlePendingOpenDialogue = (row: any) => {
    dispatch(openDialog({ type: "pending", data: row }));
  };
  const handleOpenDialogue = (row: any) => {
    dispatch(openDialog({ type: "cancel", data: row }));
  };

  const handleCompletedDialogue = (row: any) => {
    dispatch(openDialog({ type: "completed", data: row }));
  };

  const handleConfirmDialogue = (row: any) => {
    dispatch(openDialog({ type: "confirm", data: row }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const bookingTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: any }) => (
        <span>{page * rowsPerPage + parseInt(index) + 1}</span>
      ),
    },

    {
      Header: "Studio",
      Cell: ({ row }: { row: userBookingData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LazyImage
            src={row?.doctor?.[0]?.image || `/images/user.jpg`}
            alt=""
            style={{ height: 40, width: 40, borderRadius: 8, objectFit: "cover", border: "2px solid #E5E7EB" }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
              {row?.doctor?.[0]?.studioName || row?.doctor?.[0]?.name || "—"}
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{row?.user?.name}</div>
          </div>
        </div>
      ),
    },

    {
      Header: "Booking Id",
      Cell: ({ row }: { row: userBookingData }) => (
        <span className="text-capitalize cursor">
          {row?.appointmentId}{" "}
          <IconCopy
            size={16}
            className="ms-1"
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard(row?.appointmentId)}
          />
        </span>
      ),
    },

    {
      Header: "Service",
      Cell: ({ row }: { row: userBookingData }) => (
        <span className="dt-badge dt-badge-indigo">{row?.service || "—"}</span>
      ),
    },

    {
      Header: "Time",
      Cell: ({ row }: { row: userBookingData }) => (
        <span className="text-capitalize cursor">{row?.time}</span>
      ),
    },

    {
      Header: `Amount(${setting?.currencySymbol || '₹'})`,
      Cell: ({ row }: { row: userBookingData }) => (
        <span className="text-capitalize cursor">
          {row?.amount} {setting?.currencySymbol || '₹'}
        </span>
      ),
    },

    {
      Header: "Status",
      Cell: ({ row }) =>
        row?.status === 1 ? (
          <button
            className="badge-primary"
            onClick={() => handlePendingOpenDialogue(row)}
          >
            Pending
          </button>
        ) : row?.status === 2 ? (
          <button
            className="badge-warning"
            onClick={() => handleConfirmDialogue(row)}
          >
            Confirm
          </button>
        ) : row?.status === 3 ? (
          <button
            className="badge-success"
            onClick={() => handleCompletedDialogue(row)}
          >
            Completed
          </button>
        ) : row?.status === 4 ? (
          <button
            className="badge-danger"
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenDialogue(row)}
          >
            Cancel
          </button>
        ) : (
          ""
        ),
    },

    {
      Header: "Date",
      Cell: ({ row }: { row: userBookingData }) => (
        <span className="text-capitalize fw-bold cursor">{row?.date}</span>
      ),
    },
  ];
  return (
    <div className="userPage">
      <div className="d-flex justify-content-between">
        <Button
          text={`Back`}
          bIcon={<IconChevronLeft size={18} />}
          onClick={() => {
            router.back();
          }}
        />
        <Analytics
          analyticsStartDate={startDate}
          analyticsStartEnd={endDate}
          analyticsStartDateSet={setStartDate}
          analyticsStartEndSet={setEndDate}
        />
      </div>
      <div className="user-table my-3">
        <div className="user-table-top">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="w-100">
              <h5 className="main-title">
                {name ? `${name}'s Bookings` : "User's Bookings"}
              </h5>
            </div>
            <div className="d-flex gap-2 justify-content-end w-100">
              <div className="inputData w-25">
                <select
                  name="bookingType"
                  className="form-select mt-1 mb-3"
                  id="bookingType"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  {bookingType?.map((data) => {
                    return <option value={data?.value}>{data?.name}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>

        <Table
          type={"server"}
          data={booking}
          mapData={bookingTable}
          serverPerPage={rowsPerPage}
          Page={page}
        />

        <Pagination
          type={"server"}
          serverPage={page}
          setServerPage={setPage}
          serverPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalData={total}
        />
        {dialogueType == "pending" ? (
          <PendingBookingDialog />
        ) : dialogueType == "cancel" ? (
          <CancelBooking />
        ) : dialogueType == "completed" ? (
          <CompletedBooking />
        ) : (
          dialogueType == "confirm" && <ConfirmBooking />
        )}
      </div>
    </div>
  );
}

UserBooking.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
