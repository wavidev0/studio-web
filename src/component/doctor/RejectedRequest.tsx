import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getRejectedRequest } from "@/store/doctorSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RejectedRequest = () => {
  const { doctorRejectedRequest } = useSelector(
    (state: RootStore) => state.doctor,
  );
  const { setting }: any = useSelector((state: RootStore) => state?.setting);

  const router = useRouter();

  const dispatch = useAppDispatch();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<string | undefined>("ALL");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [expandedReviews, setExpandedReviews] = useState({});
  const toggleReview = (index: number) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    const payload: any = {
      start: page,
      limit: rowsPerPage,
      search,
    };
    dispatch(getRejectedRequest(payload));
  }, [dispatch, page, rowsPerPage, search]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const doctorRejectedRequestTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: number }) => (
        <span>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Image",
      Cell: ({ row }) => (
        <div className="userProfile">
          <img
            src={row?.image || `/images/user.jpg`}
            style={{ height: "50px", width: "50px", overflow: "hidden" }}
            alt={`Doctor`}
          />
        </div>
      ),
    },
    {
      Header: "Name",
      Cell: ({ row }) => (
        <span className="text-capitalize cursor">{row?.name}</span>
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
      Cell: ({ row }) => (
        <span className="text-capitalize">
          {row?.charge?.toFixed()} {setting?.currencySymbol || "$"}
        </span>
      ),
      sorting: { type: "client" },
    },
    {
      Header: "Clinic Name",
      Cell: ({ row }) => <span>{row?.clinicName ? row?.clinicName : "-"}</span>,
    },
    {
      Header: "Your Self",
      Cell: ({ row, index }) => {
        const isExpanded = expandedReviews[index];
        const reviewText = row?.yourSelf;
        const previewText = reviewText?.substring(0, 30);

        return (
          <span className="text-capitalize padding-left-2px">
            {isExpanded ? reviewText : previewText}
            {reviewText?.length > 10 && (
              <span
                onClick={() => toggleReview(index)}
                className=" text-primary bg-none cursor-pointer"
              >
                {isExpanded ? "Read less" : "Read more..."}
              </span>
            )}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div className="user-table">
        <Table
          data={doctorRejectedRequest}
          mapData={doctorRejectedRequestTable}
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
          totalData={doctorRejectedRequest?.length}
        />
      </div>
    </>
  );
};

export default RejectedRequest;
