import RootLayout from "@/component/layout/Layout";
import Button from '@/extra/Button';
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import Title from "@/extra/Title";
import { getParticularDoctorEarning } from "@/store/doctorSlice";
import { getSetting } from '@/store/settingSlice';
import { RootStore, useAppDispatch } from "@/store/store";
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface DoctorEarning {
  amount?: any;
  date?: any;
  time?: any;
  wallet?: any;
  appointment?: any;
}

const DoctorEarning = () => {
  const { doctorAppointment, total, doctorEarning, wallet } = useSelector(
    (state: RootStore) => state?.doctor
  );
  const { setting }: any = useSelector((state: RootStore) => state?.setting);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const id: any = router?.query?.id;
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [status, setStatus] = useState<any>(1);

  useEffect(() => {
    let payload: any = {
      doctorId: id,
      status: status,
    };
    dispatch(getParticularDoctorEarning(payload));
  }, [dispatch, id, status]);

  useEffect(() => {
    
      dispatch(getSetting())
    
  }, [])

  useEffect(() => {
    setData(doctorEarning);
  }, [doctorEarning]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  let earningTable: any;

  if (status == 2) {
    earningTable = [
      {
        Header: "No",
        Cell: ({ index }: { index: any }) => <span>{page * rowsPerPage + parseInt(index) + 1}</span>,
      },

      {
        Header: `Amount (${setting?.currencySymbol})`,
        Cell: ({ row }: { row: DoctorEarning }) => (
          <span className="text-capitalize">{row?.amount}</span>
        ),
      },
      {
        Header: "Date",
        Cell: ({ row }: { row: DoctorEarning }) => (
          <span className="text-capitalize">{row?.date}</span>
        ),
      },
      {
        Header: "Time",
        Cell: ({ row }: { row: DoctorEarning }) => (
          <span className="text-capitalize">{row?.time}</span>
        ),
      },
    ];
  } else {
    earningTable = [
      {
        Header: "No",
        Cell: ({ index }: { index: any }) => <span>{page * rowsPerPage + parseInt(index) + 1}</span>,
      },

      {
        Header: `Amount (${setting?.currencySymbol})`,
        Cell: ({ row }: { row: DoctorEarning }) => (
          <span className="text-capitalize">{row?.amount}</span>
        ),
      },
      {
        Header: "Booking Id",
        Cell: ({ row }: { row: DoctorEarning }) => (
          <span className="text-capitalize">
            {row?.appointment?.appointmentId || "-"}
          </span>
        ),
      },
      {
        Header: "Date",
        Cell: ({ row }: { row: DoctorEarning }) => (
          <span className="text-capitalize">{row?.date}</span>
        ),
      },


      {
        Header: "Time",
        Cell: ({ row }: { row: DoctorEarning }) => (
          <span className="text-capitalize">{row?.time}</span>
        ),
      },
    ];
  }

  const earningType = [
    { name: "Earning", value: 1 },
    { name: "Withdrawal", value: 2 },
  ];

  return (
    <>
      <div className="userPage">
        <div className='d-flex justify-content-end'>
          <Button
            text={`Back`}
            bIcon={<IconChevronLeft size={18} />}
            onClick={() => {
              router.back()
            }}
          />
        </div>
        <div className="d-flex justify-content-end mt-3">
          <label className="styleForTitle" htmlFor="bookingType">
            Total wallet amount :
            {' '}<b className='text-success'>{wallet ? wallet : 0}{setting?.currencySymbol}</b>
          </label>
        </div>
        <div className="user-table my-3">



          <div className="user-table-top">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="w-100">
                <h5 className="main-title">
                  Wallet History
                </h5>


              </div>

              <div className="d-flex gap-2 justify-content-end align-items-center w-100">

                <div className="inputData">
                  <select
                    name="bookingType"
                    className="form-select"
                    id="bookingType"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  >
                    <option key="All" value="All">
                      All
                    </option>
                    {earningType?.map((data) => {
                      return <option value={data?.value}>{data?.name}</option>;
                    })}
                  </select>
                </div>


              </div>
            </div>
          </div>
          <Table
            data={data}
            mapData={earningTable}
            PerPage={rowsPerPage}
            Page={page}
            type={"client"}
          />
          <Pagination
            type={"client"}
            serverPage={page}
            setServerPage={setPage}
            serverPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            totalData={data?.length}
          />
        </div>
      </div>
    </>
  );
};
DoctorEarning.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default DoctorEarning;
