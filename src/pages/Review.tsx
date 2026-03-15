import RootLayout from "@/component/layout/Layout";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { deletereview, getReview } from "@/store/reviewSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { warning } from "@/utils/Alert";
import { IconTrash, IconCopy, IconStar } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";

interface reviewData {
  _id: string;
  doctor: string;
  user: string;
  image: string;
  userImage: string;
  appointmentId: string;
  review: string;
  rating: any;
}
const Review = () => {
  const dispatch = useAppDispatch();


  const { review, total } = useSelector((state: RootStore) => state.review);
  const { dialogue, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue,
  );
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const toggleReview = (index: number) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    let payload: any = {
      start: page,
      limit: rowsPerPage,
    };
    dispatch(getReview(payload));
  }, [dispatch, page, rowsPerPage]);

  useEffect(() => {
    setData(review);
  }, [review]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const reviewTable = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Reviewed By",
      Cell: ({ row }: { row: reviewData }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={row?.userImage || row?.image || `/images/user.jpg`}
            style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "2px solid #E5E7EB", flexShrink: 0 }}
            alt=""
          />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#111827", textTransform: "capitalize" }}>
            {row?.user || "—"}
          </span>
        </div>
      ),
    },
    {
      Header: "Studio",
      Cell: ({ row }: { row: reviewData }) => (
        <span className="dt-badge dt-badge-indigo" style={{ textTransform: "capitalize" }}>
          {row?.doctor || "—"}
        </span>
      ),
    },
    {
      Header: "Booking ID",
      Cell: ({ row }: { row: reviewData }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
          {row?.appointmentId || "—"}
          {row?.appointmentId && (
            <IconCopy size={14} style={{ cursor: "pointer", color: "#9CA3AF" }}
              onClick={() => copyToClipboard(row.appointmentId)} />
          )}
        </span>
      ),
    },
    {
      Header: "Rating",
      Cell: ({ row }: { row: reviewData }) => (
        <Rating initialValue={parseInt(row?.rating)} readonly size={18} fillColor="#ffc632" />
      ),
    },
    {
      Header: "Review",
      Cell: ({ row, index }: { row: reviewData; index: number }) => {
        const isExpanded = expandedReviews[index];
        const text = row?.review || "—";
        return (
          <span style={{ fontSize: 13, color: "#374151" }}>
            {isExpanded ? text : text.substring(0, 50)}
            {text.length > 50 && (
              <span onClick={() => toggleReview(index)}
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
      Cell: ({ row }: { row: reviewData }) => (
        <button className="act-icon act-red" title="Delete" onClick={() => handleDelete(row._id)}>
          <IconTrash size={15} />
        </button>
      ),
    },
  ];

  const handleDelete = (id: any) => {

    const data = warning("Delete");
    data
      .then((logouts: any) => {
        const yes = logouts.isConfirmed;
        if (yes) {
          dispatch(deletereview(id));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="dt-page">
      <div className="dt-toolbar">
        <div className="dt-tabs">
          <button className="dt-tab dt-tab-active">
            <IconStar size={15} />
            Reviews
            <span className="dt-count" style={{ marginLeft: 6 }}>{total ?? 0}</span>
          </button>
        </div>
      </div>
      <div className="dt-content">
        <Table
          data={review}
          mapData={reviewTable}
          serverPerPage={rowsPerPage}
          Page={page}
          type="server"
        />
        <Pagination
          type="server"
          serverPage={page}
          setServerPage={setPage}
          serverPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalData={total}
        />
      </div>
    </div>
  );
};

Review.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default Review;
