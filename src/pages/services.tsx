import { DangerRight } from "@/api/toastServices";
import RootLayout from "@/component/layout/Layout";
import ServicesDialogue from "@/component/services/ServicesDialogue";
import Button from "@/extra/Button";
import LazyImage from "@/extra/ImageFallback";
import Pagination from "@/extra/Pagination";
import Searching from "@/extra/Searching";
import Table from "@/extra/Table";
import Title from "@/extra/Title";
import ToggleSwitch from "@/extra/TogggleSwitch";
import { openDialog } from "@/store/dialogSlice";
import {
  deleteService,
  getServices,
  statusService,
} from "@/store/serviceSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { warning } from "@/utils/Alert";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ServiceData {
  _id: string;
  image: string;
  name: string;
  categoryname: number;
  duration: number;
  status: false;
}

const Services = () => {
  const dispatch = useAppDispatch();


  const { service, total } = useSelector((state: RootStore) => state.service);

  const { dialogue, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue,
  );

  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [page, setPage] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<string | undefined>("ALL");

  useEffect(() => {
    const payload: any = {
      start: page,
      limit: rowsPerPage,
      search,
    };
    dispatch(getServices(payload));
  }, [dispatch, search, page, rowsPerPage]);

  useEffect(() => {
    setData(service);
  }, [service]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleFilterData = (filteredData: any) => {
    setPage(1);
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  function openImage(imageUrl: any) {
    window.open(imageUrl, "_blank");
  }

  const serviceTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: number }) => (
        <span>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Image",
      Cell: ({ row, index }: { row: ServiceData; index: number }) => (
        <div className="userProfile d-flex align-items-center justify-content-center">
          <LazyImage
            src={row?.image || `/images/noImage.jpg`}
            alt="image"
            style={{ width: "50px", height: "50px", overflow: "hidden" }}
            height={`100%`}
          />
        </div>
      ),
    },
    {
      Header: "Name",
      Cell: ({ row }: { row: ServiceData }) => (
        <span className="text-capitalize">{row?.name}</span>
      ),
    },

    {
      Header: "Status",
      Cell: ({ row }: { row: ServiceData }) => (
        <ToggleSwitch value={row?.status} onClick={() => handleStatus(row)} />
      ),
    },
    {
      Header: "Action",
      Cell: ({ row }: { row: ServiceData }) => (
        <div className="action-button">
          <button
            className="btn btn-sm"
            onClick={() =>
              row?.name.toLowerCase() !== "all" &&
                row?.name.toLowerCase() !== "general"
                ? dispatch(openDialog({ type: "service", data: row }))
                : DangerRight("This service cannot be edited")
            }
          >
            <IconEdit className="text-secondary" />
          </button>
          <button className="btn btn-sm" onClick={() => handleDelete(row)}>
            <IconTrash className="text-secondary" />
          </button>
        </div>
      ),
    },
  ];

  const handleStatus = (row: any) => {

    if (
      row?.name.toLowerCase() !== "all" &&
      row?.name.toLowerCase() !== "general"
    ) {
      dispatch(statusService(row?._id));
    } else {
      DangerRight("This service status can not be change.");
    }
  };

  const handleDelete = (row: any) => {

    if (
      row?.name.toLowerCase() === "all" ||
      row?.name.toLowerCase() === "general"
    ) {
      return DangerRight("This service can not be deleted");
    }

    if (row?.name !== "All") {
      const data: any = warning("Delete");

      data
        .then((logouts: any) => {
          const yes: any = logouts?.isConfirmed;
          if (yes) {
            dispatch(deleteService(row?._id));
          }
        })
        .catch((err: any) => console.log(err));
    }
  };

  return (
    <div className="userPage">
      <div className="user-table mb-3">
        <div className="user-table-top">
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <div className="w-100">
              <h5 className="main-title">Category</h5>
            </div>
            <div className="d-flex gap-2 justify-content-end w-100">
              <Searching
                type={`server`}
                data={service}
                setData={setData}
                column={serviceTable}
                serverSearching={handleFilterData}
              />
              <Button
                text={`Add Category`}
                bIcon={<IconPlus size={18} />}
                onClick={() => {
                  dispatch(openDialog({ type: "service" }));
                }}
              />
            </div>
          </div>
        </div>
        <Table
          type={"server"}
          data={data}
          mapData={serviceTable}
          PerPage={rowsPerPage}
          Page={page}
        />
        <Pagination
          type={"server"}
          serverPage={page}
          setServerPage={setPage}
          serverPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalData={service?.length}
        />
      </div>
      {dialogue && dialogueType === "service" && <ServicesDialogue />}
    </div>
  );
};

Services.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Services;
