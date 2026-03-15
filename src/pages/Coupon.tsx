import CouponDialogue from "@/component/coupon/CouponDialogue";
import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import Title from "@/extra/Title";
import ToggleSwitch from "@/extra/TogggleSwitch";
import { activeCoupon, deleteCoupon, getCoupon } from "@/store/couponSlice";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { warning } from "@/utils/Alert";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
interface CouponData {
  _id: string;
  title: string;
  code: string;
  description: string;
  expiryDate: string;
  discountPercent: number;
  minAmountToApply: number;
  isActive: false;
  maxDiscount: number;
  type: number;
}
const Coupon = () => {
  const dispatch = useAppDispatch();

  const { coupon } = useSelector((state: RootStore) => state.coupon);
  const { setting }: any = useSelector((state: RootStore) => state?.setting);
  const { dialogue, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue,
  );
  const [rowsPerPage, setRowsPerPage] = useState<any>(20);
  const [page, setPage] = useState<any>(0);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getCoupon());
  }, [dispatch]);

  useEffect(() => {
    setData(coupon);
  }, [coupon]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const couponTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: any }) => (
        <span>{page * rowsPerPage + parseInt(index) + 1}</span>
      ),
    },
    {
      Header: "Title",
      Cell: ({ row }: { row: CouponData }) => (
        <span className="text-capitalize">{row?.title}</span>
      ),
    },
    {
      Header: "Code",
      Cell: ({ row }: { row: CouponData }) => (
        <span className="text-capitalize">{row?.code}</span>
      ),
    },
    {
      Header: "Description",
      Cell: ({ row }: { row: CouponData }) => (
        <span className="text-capitalize">{row?.description}</span>
      ),
    },
    {
      Header: "Type Of Coupon",
      Cell: ({ row }: { row: CouponData }) => (
        <span className="text-capitalize">
          {row?.type === 1
            ? "Wallet"
            : row?.type === 2
              ? "Appointment"
              : "Unknown"}
        </span>
      ),
    },
    {
      Header: "Discount (%)",
      Cell: ({ row }: { row: CouponData }) => (
        <span className="text-capitalize ">
          {Number(row?.discountPercent)
            ? `${row.discountPercent} %`
            : "Not Applicable"}
        </span>
      ),
    },
    {
      Header: `Minimum Amount To Apply (${setting?.currencySymbol || "$"})`,
      Cell: ({ row }: { row: CouponData }) => (
        <span className="text-capitalize">
          {row?.minAmountToApply} {setting?.currencySymbol || "$"}
        </span>
      ),
    },
    {
      Header: "Maximum Discount",
      Cell: ({ row }: { row: CouponData }) => (
        <span className="text-capitalize">{row?.maxDiscount}</span>
      ),
    },
    {
      Header: "Active",
      Cell: ({ row }: { row: CouponData }) => (
        <ToggleSwitch
          value={row?.isActive}
          onClick={() => handleStatus(row?._id)}
        />
      ),
    },
    {
      Header: "Action",
      Cell: ({ row }: { row: CouponData }) => (
        <span className="action-button">
          <button className="btn btn-sm" onClick={() => handleDelete(row?._id)}>
            <IconTrash className="text-secondary" />
          </button>
        </span>
      ),
    },
  ];

  const handleDelete = (id: any) => {

    const data = warning("Delete");
    data
      .then((logouts) => {
        const yes = logouts.isConfirmed;
        if (yes) {
          dispatch(deleteCoupon(id));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleStatus = (couponId: any) => {


    dispatch(activeCoupon(couponId));
  };

  return (
    <>
      {dialogueType === "coupon" && <CouponDialogue />}
      <div className="userPage">
        <div className="user-table mb-3">
          <div className="user-table-top">
            <div className=" d-flex justify-content-between align-items-center w-100 ">
              <div className="w-100">
                <h5 className="main-title">Coupons</h5>
              </div>
              <div className="d-flex gap-2 justify-content-end w-100">
                <Button
                  bIcon={<IconPlus size={18} />}
                  text="Add Coupon"
                  onClick={() => {
                    dispatch(openDialog({ type: "coupon" }));
                  }}
                />
              </div>
            </div>
          </div>
          <Table
            type={"client"}
            data={data}
            mapData={couponTable}
            PerPage={rowsPerPage}
            Page={page}
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
Coupon.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default Coupon;
