import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { openDialog } from "@/store/dialogSlice";
import {
  doctorActionDeclined,
  getPendingRequest,
} from "@/store/doctorSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PendingRequestDialog from "./PendingRequestDialog";
import LazyImage from '@/extra/ImageFallback';
import { IconCircleCheck, IconCircleDashedCheck, IconCircleDashedX, IconCircleX } from '@tabler/icons-react';
import { warningForText } from '@/utils/Alert';

const PendingRequest = () => {
  const { doctorPendingRequest, total } = useSelector(
    (state: RootStore) => state.doctor
  );
  const { setting }: any = useSelector((state: RootStore) => state?.setting);

  const { dialogue, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const router = useRouter();

  const dispatch = useAppDispatch();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<string | undefined>("ALL");
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const payload: any = {
      start: page,
      limit: rowsPerPage,
      search,
    };
    dispatch(getPendingRequest(payload));
  }, [dispatch, page, rowsPerPage, search]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleDecline = (id: any) => {
    const data: any = warningForText("Are You Sure?", "Do you really want to reject this doctor?");
    data.then((res: any) => {
      if (res.isConfirmed) {
        dispatch(doctorActionDeclined(id));
      }
    }).catch((err: any) => {
      console.log(err);
    });

  }

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const doctorPendingRequestTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: number }) => (
        <span>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Image",
      Cell: ({ row }) => (
        <div className="userProfile d-flex justify-content-center align-items-center">
          <LazyImage src={row?.image || `/images/user.jpg`} style={{ height: "50px", width: "50px", overflow: "hidden" }} alt={`Doctor`} />
        </div>
      ),
    },
    {
      Header: "Name",
      Cell: ({ row }) => (
        <span className="text-capitalize fw-bold cursor">{row?.name}</span>
      ),
    },
    {
      Header: "Mobile No",
      Cell: ({ row }) => <span>{row?.mobile ? row?.mobile : "-"}</span>,
    },
    {
      Header: "Country",
      Cell: ({ row }) => <span>{row?.country}</span>,
    },
    {
      Header: `Charge (${setting?.currencySymbol || "$"})`,
      body: "platformFee",
      sorting: { type: "client" },
      Cell: ({ row }) => (
        <span className="text-capitalize fw-bold">{row?.charge.toFixed()} {setting?.currencySymbol || "$"}</span>
      ),
    },
    {
      Header: "Clinic Name",
      Cell: ({ row }) => <span>{row?.clinicName ? row?.clinicName : "-"}</span>,
    },
    {
      Header: "Accept",
      Cell: ({ row }) => (
        <div className='action-button'>
          <button
            className="btn btn-sm"
            onClick={() => {
              dispatch(openDialog({ type: "pendingcomplain", data: row }))
            }
            }
          >
            <IconCircleCheck className="text-secondary" />
          </button>
        </div>
      ),
    },

    {
      Header: "Decline",
      Cell: ({ row }) => (
        <div className='action-button'>
          <button
            className="btn btn-sm"
            onClick={() => handleDecline(row._id)}
          >
            <IconCircleX className="text-secondary" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className='user-table'>
        {dialogueType == "pendingcomplain" && <PendingRequestDialog />}
        <Table
          data={doctorPendingRequest}
          mapData={doctorPendingRequestTable}
          PerPage={rowsPerPage}
          Page={page}
          type={"server"}
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
    </>
  );
};

export default PendingRequest;
