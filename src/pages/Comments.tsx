import RootLayout from "@/component/layout/Layout";
import Table from "@/extra/Table";
import Title from "@/extra/Title";
import { deleteDoctorComment, getVideoComment } from "@/store/doctorSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { warning } from "@/utils/Alert";
import { IconTrash } from '@tabler/icons-react';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface commentData {
  _id: string;
  userImage: string;
  name: string;
  createdAt: string;
  commentText: string;
  time: string;
}

const Review = () => {
  const dispatch = useAppDispatch();


  const { videoComments, total } = useSelector(
    (state: RootStore) => state.doctor
  );

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const router = useRouter();
  const id: any = router?.query?.id;

  const [expandedReviews, setExpandedReviews] = useState({});
  const toggleReview = (index: number) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    dispatch(getVideoComment(id));
  }, [dispatch]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const commentTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: number }) => (
        <span>{page * rowsPerPage + index + 1}</span>
      ),
    },

    {
      Header: "Image",
      Cell: ({ row }: { row: commentData }) => (
        <div className="userProfile">
          <img
            src={row && row?.userImage || `/images/user.jpg`}
            style={{ height: "70px", width: "70px", overflow: "hidden" }}
            alt="salon"
            className="cursor-pointer"
            height={`100%`}
          />
        </div>
      ),
    },

    {
      Header: "User",
      Cell: ({ row }: { row: commentData }) => (
        <span className="text-capitalize">{row?.name}</span>
      ),
    },

    {
      Header: "Comments",
      Cell: ({ row, index }) => {
        const isExpanded = expandedReviews[index];
        const reviewText = row?.commentText;
        const previewText = reviewText?.substring(0, 30);

        return (
          <span className="text-capitalize fw-bold padding-left-2px">
            {isExpanded ? reviewText : previewText}
            {reviewText.length > 30 && (
              <span
                onClick={() => toggleReview(index)}
                className="read-more text-primary bg-none ps-2 cursor-pointer"
              >
                {isExpanded ? "Read less" : "Read more..."}
              </span>
            )}
          </span>
        );
      },
    },

    {
      Header: "CreatedAt",
      Cell: ({ row }: { row: commentData }) => (
        <span className="text-capitalize fw-bold">
          {row?.createdAt?.split("T")[0]}
        </span>
      ),
    },

    {
      Header: "Time",
      Cell: ({ row }: { row: commentData }) => (
        <span className="text-capitalize">{row?.time}</span>
      ),
    },
    {
      Header: "Action",
      Cell: ({ row }: { row: commentData }) => (
        <div className='action-button'>
          <button
            className="btn btn-sm"
            onClick={() => handleDelete(row?._id)}
          >
            <IconTrash className="text-secondary" />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = (id: any) => {

    const data = warning("Delete");
    data
      .then((logouts: any) => {
        const yes = logouts.isConfirmed;
        if (yes) {
          dispatch(deleteDoctorComment(id));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <>
        <div className="userPage">
          <div className="user-table mb-3">
            <div className="user-table-top">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="w-100">
                  <h5 className="main-title">
                    Comments
                  </h5>
                </div>
              </div>
            </div>
            <div>
              <Table
                data={videoComments}
                mapData={commentTable}
                serverPerPage={rowsPerPage}
                Page={page}
                type={"server"}
              />
            </div>
          </div>
        </div>
      </>
    </>
  );
};

Review.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default Review;
