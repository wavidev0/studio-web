import CancelBooking from "@/component/booking/CancelBooking";
import CompletedBooking from "@/component/booking/CompletedBooking";
import ConfirmBooking from "@/component/booking/ConfirmBooking";
import PendingBookingDialog from "@/component/booking/PendingBookingDialog";
import RootLayout from "@/component/layout/Layout";
import Analytics from "@/extra/Analytic";
import Button from "@/extra/Button";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import Title from "@/extra/Title";
import { openDialog } from "@/store/dialogSlice";
import { getParticularDoctorAppointment } from "@/store/doctorSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { IconChevronLeft,IconCopy } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface bookingData {
  _id: any;
  time: string;
  amount: number;
  user: {
    name: string;
    image: string;
    _id: string;
  };

  date: string;
  appointmentId: any;
  doctor: {
    name: string;
  };
  service: string;
}

const DoctorBooking = () => {
  const { doctorAppointment, total } = useSelector(
    (state: RootStore) => state?.doctor,
  );

  const { setting }: any = useSelector((state: RootStore) => state?.setting);

  const [startDate, setStartDate] = useState("ALL");
  const [endDate, setEndDate] = useState("ALL");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [status, setStatus] = useState<string>("ALL");
  const dispatch = useAppDispatch();
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);

  const router = useRouter();
  const id: any = router?.query?.id;
  const drName: any = router?.query?.drName;

  useEffect(() => {
    let payload: any = {
      doctorId: id,
      start: page,
      limit: rowsPerPage,
      startDate: startDate,
      endDate: endDate,
      status: status,
    };
    dispatch(getParticularDoctorAppointment(payload));
  }, [dispatch, id, page, rowsPerPage, startDate, endDate, status]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

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

  const handleInfo = (id: any) => {
    router.push({
      pathname: "/UserProfile",
      query: { id: id },
    });
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
      Header: "User",
      Cell: ({ row, index }: { row: bookingData; index: number }) => (
        <div className="userProfile" onClick={() => handleInfo(row?.user?._id)}>
          <img
            src={row?.user?.image || `/images/user.jpg`}
            style={{ width: "50px", height: "50px", overflow: "hidden" }}
            alt={`Doctor ${page * rowsPerPage + index + 1}`}
          />
        </div>
      ),
    },

    {
      Header: "Name",
      Cell: ({ row }: { row: bookingData }) => (
        <span
          className="text-capitalize cursor"
          onClick={() => handleInfo(row?.user?._id)}
        >
          {row?.user?.name}
        </span>
      ),
    },

    {
      Header: "Doctor",
      Cell: ({ row }: { row: bookingData }) => (
        <span className="text-capitalize cursor">{row?.doctor?.name}</span>
      ),
    },

    {
      Header: "Booking Id",
      Cell: ({ row }: { row: bookingData }) => (
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
      Cell: ({ row }: { row: bookingData }) => (
        <span className="text-capitalize cursor">{row?.service}</span>
      ),
    },

    {
      Header: "Time",
      Cell: ({ row }: { row: bookingData }) => (
        <span className="text-capitalize cursor">{row?.time}</span>
      ),
    },

    {
      Header: `Amount (${setting?.currencySymbol || "$"})`,
      Cell: ({ row }: { row: bookingData }) => (
        <span className="text-capitalize cursor">
          {row?.amount} {setting?.currencySymbol || "$"}
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
      Cell: ({ row }: { row: bookingData }) => (
        <span className="text-capitalize cursor">{row?.date}</span>
      ),
    },
  ];

  const bookingType = [
    { name: "All", value: "ALL" },
    { name: "Pending", value: 1 },
    { name: "Completed", value: 3 },
    { name: "Cancelled", value: 4 },
  ];
  return (
    <>
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
                  {drName ? `${drName}'s Bookings` : `Doctor's Bookings`}
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

          {/* <Title name="Bookings" /> */}
          {dialogueType == "pending" ? (
            <PendingBookingDialog />
          ) : dialogueType == "cancel" ? (
            <CancelBooking />
          ) : dialogueType == "completed" ? (
            <CompletedBooking />
          ) : (
            dialogueType == "confirm" && <ConfirmBooking />
          )}

          <div>
            <Table
              type={"server"}
              data={doctorAppointment}
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
          </div>
        </div>
      </div>
    </>
  );
};

DoctorBooking.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default DoctorBooking;
