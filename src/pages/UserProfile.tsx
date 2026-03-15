import React, { useEffect, useState } from "react";
import RootLayout from "../component/layout/Layout";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ExInput, Textarea } from "@/extra/Input";
import { useSelector } from "react-redux";
import { isLoading } from "@/utils/allSelector";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/router";
import Table from "@/extra/Table";
import Pagination from "@/extra/Pagination";
import { getUserProfile, getUserWalletHistory } from "@/store/userSlice";
import Button from "@/extra/Button";
import { IconChevronLeft, IconLock, IconLockOpen, IconWallet, IconUser } from "@tabler/icons-react";

interface RootStore {
  setting: any;
  user: {
    userProfile: any;
    userWalletHistory: any;
    user: any;
  };
}

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const id: any = router?.query?.id;

  const loader = useSelector(isLoading);
  const { userProfile, userWalletHistory } = useSelector((state: RootStore) => state.user);
  const { setting } = useSelector((state: RootStore) => state.setting);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [status, setStatus] = useState<any>("ALL");

  useEffect(() => {
    dispatch(getUserProfile(id));
    dispatch(getUserWalletHistory({ id, status, startDate: "ALL", endDate: "ALL" }));
  }, [dispatch, id, status]);

  const handleChangePage = (_: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => { setRowsPerPage(parseInt(e, 10)); setPage(0); };

  const loginTypeLabel = (type: number) => {
    if (type === 1) return "Email & Password";
    if (type === 2) return "Google";
    if (type === 3) return "Mobile";
    if (type === 4) return "Apple";
    return "—";
  };

  const walletTable = [
    {
      Header: "#",
      Cell: ({ index }: { index: number }) => (
        <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{page * rowsPerPage + index + 1}</span>
      ),
    },
    {
      Header: "Unique ID",
      Cell: ({ row }: { row: any }) => <span>{row?.uniqueId || "—"}</span>,
    },
    {
      Header: `Amount (${setting?.currencySymbol || "$"})`,
      Cell: ({ row }: { row: any }) => <span style={{ fontWeight: 600 }}>{row?.amount ?? "—"}</span>,
    },
    {
      Header: "Date",
      Cell: ({ row }: { row: any }) => <span>{row?.date || "—"}</span>,
    },
    {
      Header: "Time",
      Cell: ({ row }: { row: any }) => <span>{row?.time || "—"}</span>,
    },
    {
      Header: "Type",
      Cell: ({ row }: { row: any }) =>
        row?.type === 1 || row?.type === 3 ? (
          <span className="dt-badge dt-badge-blue">Credit</span>
        ) : (
          <span className="dt-badge" style={{ background: "#FEE2E2", color: "#DC2626" }}>Debit</span>
        ),
    },
    {
      Header: "Description",
      Cell: ({ row }: { row: any }) =>
        row?.type === 1 ? (
          <span className="dt-badge dt-badge-blue">Wallet Deposit</span>
        ) : row?.type === 2 ? (
          <span className="dt-badge dt-badge-gray">Booking Fee Deduction</span>
        ) : row?.type === 3 ? (
          <span className="dt-badge dt-badge-indigo">Booking Fee Refund</span>
        ) : "—",
    },
  ];

  const Field = ({ label, value }: { label: string; value: any }) =>
    loader ? (
      <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
        <Skeleton height={40} className="mt-3" />
      </SkeletonTheme>
    ) : (
      <ExInput label={label} value={value || "—"} readOnly placeholder={label} />
    );

  return (
    <div className="p-3">
      <div className="card1">
        {/* Header */}
        <div className="cardHeader p-3">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              {userProfile?.name ? `${userProfile.name}'s Profile` : "User Profile"}
            </h5>
            <Button
              text="Back"
              bIcon={<IconChevronLeft size={18} />}
              onClick={() => router.back()}
            />
          </div>
        </div>

        <div className="card-body">
          <div className="row p-3">
            {/* Avatar */}
            <div className="col-lg-3 col-md-4 col-12 mb-3">
              {loader ? (
                <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                  <Skeleton height={280} style={{ borderRadius: 10 }} />
                </SkeletonTheme>
              ) : (
                <img
                  src={userProfile?.image || `/images/user.jpg`}
                  alt="User"
                  style={{ width: "100%", height: 280, objectFit: "cover", objectPosition: "top", borderRadius: 10 }}
                />
              )}
            </div>

            {/* Info Fields */}
            <div className="col-lg-9 col-md-8 col-12">
              <div className="row">
                <div className="col-md-4"><Field label="Name" value={userProfile?.name} /></div>
                <div className="col-md-4"><Field label="Email" value={userProfile?.email} /></div>
                <div className="col-md-4"><Field label="Mobile" value={userProfile?.mobile} /></div>
                <div className="col-md-4"><Field label="Gender" value={userProfile?.gender} /></div>
                <div className="col-md-4"><Field label="Date of Birth" value={userProfile?.dob} /></div>
                <div className="col-md-4"><Field label="Country" value={userProfile?.country} /></div>
                <div className="col-md-4"><Field label="City" value={userProfile?.city} /></div>
                <div className="col-md-4"><Field label="Unique ID" value={userProfile?.uniqueId} /></div>
                <div className="col-md-4"><Field label="Login Type" value={loginTypeLabel(userProfile?.loginType)} /></div>
                <div className="col-md-4">
                  <div className="custom-input mt-1">
                    <label>Status</label>
                    <div className="mt-1">
                      <span className={`dt-status-pill ${userProfile?.isBlock ? "dt-status-blocked" : "dt-status-active"}`}>
                        {userProfile?.isBlock ? <IconLock size={12} /> : <IconLockOpen size={12} />}
                        {userProfile?.isBlock ? "Blocked" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  {loader ? (
                    <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                      <Skeleton height={80} className="mt-3" />
                    </SkeletonTheme>
                  ) : (
                    <Textarea label="Bio" value={userProfile?.bio || "—"} row={3} disabled={true} placeholder="Bio" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Wallet History */}
          <div className="p-3">
            <div className="dt-content-header mb-3">
              <h5 className="dt-content-title">
                <IconWallet size={18} className="me-1" />
                Wallet History
              </h5>
              <select
                className="form-select"
                style={{ width: 150 }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value={1}>Credit</option>
                <option value={2}>Debit</option>
              </select>
            </div>
            <Table
              type="client"
              data={userWalletHistory}
              mapData={walletTable}
              PerPage={rowsPerPage}
              Page={page}
            />
            <Pagination
              type="client"
              serverPage={page}
              setServerPage={setPage}
              serverPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              totalData={userWalletHistory?.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

UserProfile.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default UserProfile;
