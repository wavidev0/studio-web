import SuggestedServiceDialogue from "@/component/SuggestedService/SuggestedServiceDialogue";
import RootLayout from "@/component/layout/Layout";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { declineSuggestedServiceRequest, getSuggestedServices } from "@/store/suggestedServiceSlice";
import { warning } from "@/utils/Alert";
import { IconCircleCheck, IconCircleX, IconTag } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface SuggestedServiceData {
  _id: string;
  doctor: string;
  name: string;
  description: string;
}

const SuggestedService = () => {
  const dispatch = useAppDispatch();
  const { suggestedService } = useSelector((state: RootStore) => state.suggestedService);
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [expandedRows, setExpandedRows] = useState<any>({});

  useEffect(() => { dispatch(getSuggestedServices()); }, [dispatch]);

  const toggleExpand = (index: number) => setExpandedRows((p: any) => ({ ...p, [index]: !p[index] }));
  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };

  const handleDecline = (id: any) => {
    warning("Decline").then((r: any) => {
      if (r.isConfirmed) dispatch(declineSuggestedServiceRequest(id));
    }).catch(console.log);
  };

  const columns = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Service Name",
      Cell: ({ row }: { row: SuggestedServiceData }) => (
        <span className="dt-badge dt-badge-indigo" style={{ textTransform: "capitalize" }}>
          {row?.name || "—"}
        </span>
      ),
    },
    {
      Header: "Studio",
      Cell: ({ row }: { row: SuggestedServiceData }) => (
        <span style={{ fontWeight: 600, fontSize: 13, color: "#111827", textTransform: "capitalize" }}>
          {row?.doctor || "—"}
        </span>
      ),
    },
    {
      Header: "Description",
      Cell: ({ row, index }: { row: SuggestedServiceData; index: number }) => {
        const text = row?.description || "—";
        const isExpanded = expandedRows[index];
        return (
          <span style={{ fontSize: 13, color: "#374151" }}>
            {isExpanded ? text : text.substring(0, 50)}
            {text.length > 50 && (
              <span onClick={() => toggleExpand(index)}
                style={{ color: "#6366F1", cursor: "pointer", fontWeight: 600, marginLeft: 4, fontSize: 12 }}>
                {isExpanded ? " Read less" : " Read more..."}
              </span>
            )}
          </span>
        );
      },
    },
    {
      Header: "Actions",
      Cell: ({ row }: { row: SuggestedServiceData }) => (
        <div className="act-group">
          <button
            className="act-icon act-blue"
            title="Approve"
            onClick={() => dispatch(openDialog({ type: "suggestedService", data: row }))}
          >
            <IconCircleCheck size={16} />
          </button>
          <button
            className="act-icon act-red"
            title="Decline"
            onClick={() => handleDecline(row._id)}
          >
            <IconCircleX size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="dt-page">
      <div className="dt-toolbar">
        <div className="dt-tabs">
          <button className="dt-tab dt-tab-active">
            <IconTag size={15} />
            Suggested Services
            <span className="dt-count" style={{ marginLeft: 6 }}>{suggestedService?.length ?? 0}</span>
          </button>
        </div>
      </div>

      <div className="dt-content">
        <Table data={suggestedService} mapData={columns} PerPage={rowsPerPage} Page={page} type="client" />
        <Pagination
          type="client"
          serverPage={page}
          setServerPage={setPage}
          serverPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalData={suggestedService?.length}
        />
      </div>

      {dialogueType === "suggestedService" && <SuggestedServiceDialogue />}
    </div>
  );
};

SuggestedService.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default SuggestedService;
