import React, { useEffect, useState } from "react";
import RootLayout from "../component/layout/Layout";
import Title from "@/extra/Title";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ExInput, Textarea } from "@/extra/Input";
import { useSelector } from "react-redux";
import { isLoading } from "@/utils/allSelector";
import { RootStore, useAppDispatch } from "@/store/store";
import {
  deleteDoctorVideo,
  getDoctorProfile,
  getDoctorReview,
  getDoctorVideo,
} from "@/store/doctorSlice";
import { warning } from "@/utils/Alert";
import { useRouter } from "next/router";
import Table from "@/extra/Table";
import Pagination from "@/extra/Pagination";
import { IconChevronLeft, IconMessageDots, IconTrash } from '@tabler/icons-react';
import LazyImage from '@/extra/ImageFallback';
import MultiButton from '@/extra/MultiButton';
import Button from '@/extra/Button';

interface Doctor {
  _id: string;
  name: string;
  image: string;
  description: string;
  rating?: string;
  review?: string;
  createdAt?: string;
  videoImage?: string;
  videoUrl?: string;
}

const DoctorProfile = () => {
  const dispatch = useAppDispatch();
  const { doctorProfile, doctorReview, doctorVideo } = useSelector(
    (state: RootStore) => state.doctor
  );


  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const { setting }: any = useSelector((state: RootStore) => state?.setting);


  const src = `https://maps.google.com/maps?q=${doctorProfile?.latitude},${doctorProfile?.longitude}&hl=es;&output=embed`;
  const loader = useSelector(isLoading);
  const router = useRouter();
  const id: any = router?.query?.id;
  const [type, setType] = useState<string>("address");
  const [data, setData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const toggleReview = (index: number) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    const payload = {
      start: page,
      limit: rowsPerPage,
      id,
    };
    dispatch(getDoctorReview(payload));
    dispatch(getDoctorVideo(id));
    dispatch(getDoctorProfile(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (doctorProfile) {
      //   setData();
    } else {
      //   setData();
    }
  }, []);

  const handleDelete = async (row: any) => {

    try {
      const data = await warning("Delete");
      const yes = data?.isConfirmed;
      if (yes) {
        const id: any = router?.query?.id;

        const paylaod = {
          videoId: row?._id,
          doctorId: id,
        };
        dispatch(deleteDoctorVideo(paylaod));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleInfo = (id: any) => {
    router.push({
      pathname: "/Comments",
      query: { id: id?._id },
    });
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const serviceTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: any }) => (
        <span>{page * rowsPerPage + parseInt(index) + 1}</span>
      ),
    },
    {
      Header: "Name",
      Cell: ({ row }: { row: Doctor }) => (
        <span className="text-capitalize">{row?.name}</span>
      ),
    },
    {
      Header: "Image",
      Cell: ({ row }: { row: Doctor }) => (
        <div className="userProfile">
          <LazyImage
            src={row && row.image || `/images/user.jpg`}
            style={{ height: "50px", width: "50px", overflow: "hidden" }}
            alt="salon"
            className="cursor-pointer"
            height={`100%`}
          />
        </div>
      ),
    },
  ];

  const reviewTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: any }) => (
        <span>{page * rowsPerPage + parseInt(index) + 1}</span>
      ),
    },
    {
      Header: "Rating",
      Cell: ({ row }: { row: Doctor }) => (
        <span className="text-capitalize">{row?.rating}</span>
      ),
    },

    {
      Header: "Review",
      Cell: ({ row, index }) => {
        const isExpanded = expandedReviews[index];
        const reviewText = row?.review;
        const previewText = reviewText?.substring(0, 30);

        return (
          <span className="text-capitalize">
            {isExpanded ? reviewText : previewText}
            {reviewText.length > 100 && (
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
      Cell: ({ row }: { row: Doctor }) => (
        <span className="text-capitalize">
          {row?.createdAt?.split("T")[0]}
        </span>
      ),
    },
  ];

  const videoTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: any }) => (
        <span>{page * rowsPerPage + parseInt(index) + 1}</span>
      ),
    },

    {
      Header: "Thumbnail",
      Cell: ({ row }: { row: Doctor }) => (
        <div className="userProfile">
          <LazyImage
            src={row && row?.videoImage}
            style={{ height: "100px", width: "100px", overflow: "hidden" }}
            alt="salon"
            className="cursor-pointer"
            height={`100%`}
          />
        </div>
      ),
    },

    {
      Header: "Video",
      Cell: ({ row }: { row: Doctor }) => (
        <div className="userProfile">
          <video
            controls
            src={row && row?.videoUrl}
            style={{
              height: "100px",
              width: "150px",
              overflow: "hidden",
              borderRadius: "10px",
            }}
            className="cursor-pointer"
            height={`100%`}
            muted
          />
        </div>
      ),
    },

    {
      Header: "CreatedAt",
      Cell: ({ row }: { row: Doctor }) => (
        <span className="text-capitalize">
          {row?.createdAt?.split("T")[0]}
        </span>
      ),
    },

    {
      Header: "Description",
      Cell: ({ row, index }) => {
        const isExpanded = expandedReviews[index];
        const reviewText = row?.description;
        const previewText = reviewText?.substring(0, 30);

        return (
          <span className="text-capitalize">
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
      Header: "Comments",
      Cell: ({ row }: { row: Doctor }) => (
        <span className="action-button">
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "#FFF1F1",
              borderRadius: "8px",
              height: "50px",
              width: "50px",
            }}
            onClick={() => handleInfo(row)}
          >
            <IconMessageDots className='text-secondary' />
          </button>
        </span>
      ),
    },
    {
      Header: "Delete",
      Cell: ({ row }: { row: Doctor }) => (
        <span className="action-button">
          <button
            className="btn btn-sm"
            style={{ backgroundColor: "#FFF1F1", borderRadius: "8px" }}
            onClick={() => handleDelete(row)}
          >
            <IconTrash className="text-secondary" />
          </button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="p-3">
        <div className="card1">
          <div className="cardHeader p-3">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0">{doctorProfile?.studioName ? `${doctorProfile?.studioName} Profile` : doctorProfile?.name ? `${doctorProfile?.name}'s Profile` : "Studio Profile"}</h5>
              <Button
                text={`Back`}
                bIcon={<IconChevronLeft size={18} />}
                onClick={() => {
                  router.back()
                }}
              />
              {/* </div> */}
            </div>
          </div>
          <div className="card-body">
            <div className="row p-3">
              <div className="col-lg-4 col-md-6 col-12">
                {loader === true ? (
                  <>
                    <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                      <p className="d-flex justify-content-center">
                        <Skeleton
                          height={380}
                          width={380}
                          style={{
                            height: "380px",
                            width: "380px",
                            objectFit: "cover",
                            boxSizing: "border-box",
                            borderRadius: "30px",
                          }}
                        />
                      </p>
                    </SkeletonTheme>
                  </>
                ) : (
                  <img
                    src={doctorProfile?.image || `/images/user.jpg`}
                    className="img-fluid"
                    style={{
                      height: "380px",
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: 'top center',
                      boxSizing: "border-box",
                      borderRadius: "5px",
                    }}
                    alt=""
                  />
                )}
              </div>
              <div className="col-lg-8 col-md-6 col-12">
                <div className="row">
                  <div className="col-md-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton height={40} width={250} style={{ borderRadius: "10px" }} />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`doctorName`}
                        name={`doctorName`}
                        value={doctorProfile?.studioName || doctorProfile?.name}
                        label={`Studio Name`}
                        placeholder={`Studio Name`}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton height={40} width={250} style={{ borderRadius: "10px" }} />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`ownerName`}
                        name={`ownerName`}
                        value={doctorProfile?.name}
                        label={`Owner Name`}
                        placeholder={`Owner Name`}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton height={40} width={250} style={{ borderRadius: "10px" }} />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`email`}
                        name={`email`}
                        value={doctorProfile?.email}
                        label={`Email`}
                        placeholder={`email`}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton height={40} width={250} style={{ borderRadius: "10px" }} />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        type={`number`}
                        id={`mobileNumber`}
                        name={`mobileNumber`}
                        value={doctorProfile?.mobile}
                        label={`Mobile Number`}
                        placeholder={`mobileNumber`}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton height={40} width={250} style={{ borderRadius: "10px" }} />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`country`}
                        name={`country`}
                        value={doctorProfile?.country}
                        label={`Country`}
                        placeholder={`Country`}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton height={40} width={250} style={{ borderRadius: "10px" }} />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`city`}
                        name={`city`}
                        value={doctorProfile?.designation}
                        label={`City`}
                        placeholder={`City`}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton height={40} width={250} style={{ borderRadius: "10px" }} />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`studioId`}
                        name={`studioId`}
                        value={doctorProfile?._id}
                        label={`Studio ID`}
                        placeholder={`Studio ID`}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton height={40} width={250} style={{ borderRadius: "10px" }} />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`charge`}
                        name={`charge`}
                        value={doctorProfile?.charge ? doctorProfile?.charge : ""}
                        label={`Price/Hr (${setting?.currencySymbol || "$"})`}
                        placeholder={`Charge`}
                        readOnly
                      />
                    )}
                  </div>


                </div>

              </div>
            </div>

            <div className="row p-3">
              <h5 className="fw-semibold my-3">Studio Summary:</h5>
              <div className="col-md-4">
                {loader === true ? (
                  <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                    <p className="d-flex justify-content-center my-3"><Skeleton height={40} width={250} style={{ borderRadius: "10px" }} /></p>
                  </SkeletonTheme>
                ) : (
                  <ExInput id={`city`} name={`city`} value={doctorProfile?.designation} label={`City`} placeholder={`City`} readOnly />
                )}
              </div>
              <div className="col-md-4">
                {loader === true ? (
                  <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                    <p className="d-flex justify-content-center my-3"><Skeleton height={40} width={250} style={{ borderRadius: "10px" }} /></p>
                  </SkeletonTheme>
                ) : (
                  <ExInput id={`Equipment`} name={`Equipment`} value={doctorProfile?.equipment?.join(", ")} label={`Equipment`} placeholder={`Equipment`} readOnly />
                )}
              </div>
              <div className="col-md-4">
                {loader === true ? (
                  <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                    <p className="d-flex justify-content-center my-3"><Skeleton height={40} width={250} style={{ borderRadius: "10px" }} /></p>
                  </SkeletonTheme>
                ) : (
                  <ExInput id={`bookingCount`} name={`bookingCount`} value={doctorProfile?.bookingCount ?? 0} label={`Total Bookings`} placeholder={`Bookings`} readOnly />
                )}
              </div>
              <div className="col-12">
                {loader === true ? (
                  <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                    <p className="d-flex justify-content-center my-3"><Skeleton height={150} width={850} style={{ borderRadius: "10px" }} /></p>
                  </SkeletonTheme>
                ) : (
                  <Textarea row={4} value={doctorProfile?.studioDescription || doctorProfile?.yourSelf} readOnly label="Studio Description" />
                )}
              </div>
            </div>

            <div className="p-0 userPage">
              <div className="multi-user-btn my-3 px-3 ">
                <MultiButton multiButtonSelect={type} setMultiButtonSelect={setType} label={["address", "review", "equipment", "video"]} />
              </div>
              {type === "address" && (
                <div className="row px-3">
                  <div className="col-lg-12">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton
                              height={40}
                              width={400}
                              style={{
                                borderRadius: "10px",
                              }}
                            />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`address`}
                        name={`address`}
                        value={doctorProfile?.address}
                        label={`Address`}
                        placeholder={`address`}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="col-lg-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton
                              height={40}
                              width={400}
                              style={{
                                borderRadius: "10px",
                              }}
                            />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`country`}
                        name={`country`}
                        value={doctorProfile?.country}
                        label={`Country`}
                        placeholder={`country`}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="col-lg-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton
                              height={40}
                              width={400}
                              style={{
                                borderRadius: "10px",
                              }}
                            />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`latitude`}
                        name={`latitude`}
                        value={doctorProfile?.latitude}
                        label={`Latitude`}
                        placeholder={`latitude`}
                        readOnly
                      />
                    )}
                  </div>

                  <div className="col-lg-4">
                    {loader === true ? (
                      <>
                        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
                          <p className="d-flex justify-content-center my-3">
                            <Skeleton
                              height={40}
                              width={400}
                              style={{
                                borderRadius: "10px",
                              }}
                            />
                          </p>
                        </SkeletonTheme>
                      </>
                    ) : (
                      <ExInput
                        id={`longitude`}
                        name={`longitude`}
                        value={doctorProfile?.longitude}
                        label={`Longitude`}
                        placeholder={`longitude`}
                        readOnly
                      />
                    )}
                  </div>

                  <div>
                    <label className="mb-2">Map</label>
                    <iframe
                      src={src}
                      id="iframeId"
                      height="500px"
                      title="doctorLocation"
                      width="100%"
                    ></iframe>
                  </div>
                </div>
              )}

              {type === "review" && (
                <>
                  <Table
                    type={"client"}
                    data={doctorReview}
                    mapData={reviewTable}
                    PerPage={rowsPerPage}
                    Page={page}
                    className="border-0"
                  />

                  <Pagination
                    type={"client"}
                    serverPage={page}
                    setServerPage={setPage}
                    serverPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    totalData={doctorReview?.length}
                  />
                </>
              )}

              {type === "equipment" && (
                <>
                  <div className="row bg-white">
                    <div className="col-lg-12 col-md-12">
                      <div className="m40-top tsBox p-3 br-2">
                        <Table
                          data={doctorProfile?.service}
                          mapData={serviceTable}
                          className="border-0"
                          PerPage={rowsPerPage}
                          Page={page}
                          type={"client"}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {type === "video" && (
                <>
                  <Table
                    type={"client"}
                    data={doctorVideo}
                    mapData={videoTable}
                    PerPage={rowsPerPage}
                    Page={page}
                    className="border-0"
                  />

                  <Pagination
                    type={"client"}
                    serverPage={page}
                    setServerPage={setPage}
                    serverPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    totalData={doctorReview?.length}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
DoctorProfile.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default DoctorProfile;
