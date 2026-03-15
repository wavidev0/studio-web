import BannerDialogue from "@/component/banner/BannerDialogue";
import RootLayout from "@/component/layout/Layout";
import { activeBanner, deleteBanner, getBanner } from "@/store/bannerSlice";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { warning } from "@/utils/Alert";
import { IconEdit, IconPlus, IconTrash, IconPhoto } from "@tabler/icons-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ToggleSwitch from "@/extra/TogggleSwitch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface BannerData {
  _id: string;
  image: string;
  isActive: boolean;
  type: number;
  url?: string;
  service?: any;
}

const Banner = () => {
  const dispatch = useAppDispatch();
  const { dialogue, dialogueType } = useSelector((state: RootStore) => state.dialogue);
  const { banner, isSkeleton } = useSelector((state: RootStore) => state.banner);

  useEffect(() => {
    dispatch(getBanner());
  }, []);

  const handleDelete = (id: string) => {
    warning("Delete").then((r: any) => {
      if (r.isConfirmed) dispatch(deleteBanner(id));
    }).catch(console.log);
  };

  return (
    <div className="dt-page">
      {/* Toolbar */}
      <div className="dt-toolbar">
        <div className="dt-tabs">
          <button className="dt-tab dt-tab-active">
            <IconPhoto size={15} />
            Banners
            <span className="dt-count" style={{ marginLeft: 6 }}>{banner?.length ?? 0}</span>
          </button>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-1 px-3 py-2"
          style={{ borderRadius: 8, fontSize: 13, fontWeight: 600 }}
          onClick={() => dispatch(openDialog({ type: "banner" }))}
        >
          <IconPlus size={16} />
          Add Banner
        </button>
      </div>

      {/* Banner Grid */}
      {isSkeleton ? (
        <SkeletonTheme baseColor="#F3F4F6" highlightColor="#fff">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20, padding: "4px 0" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #F3F4F6", background: "#fff" }}>
                <Skeleton height={160} borderRadius={0} />
                <div style={{ padding: "12px 16px" }}>
                  <Skeleton width={80} height={20} borderRadius={20} />
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                    <Skeleton width={40} height={24} borderRadius={12} />
                    <Skeleton width={32} height={32} borderRadius={8} />
                    <Skeleton width={32} height={32} borderRadius={8} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SkeletonTheme>
      ) : banner?.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 text-secondary">
          <IconPhoto size={48} stroke={1} />
          <p className="mt-2">No banners yet. Click "Add Banner" to create one.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20, padding: "4px 0" }}>
          {banner?.map((row: BannerData, index: number) => (
            <div key={row._id} style={{
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              background: "#fff",
              border: "1px solid #F3F4F6",
              transition: "box-shadow 0.2s",
            }}>
              {/* Banner Image */}
              <div style={{ position: "relative", height: 160, background: "#F9FAFB" }}>
                <img
                  src={row?.image || `/images/noImage.jpg`}
                  alt={`Banner ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* Active badge */}
                <div style={{
                  position: "absolute", top: 10, left: 10,
                  background: row.isActive ? "#D1FAE5" : "#FEE2E2",
                  color: row.isActive ? "#065F46" : "#991B1B",
                  fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                }}>
                  {row.isActive ? "Active" : "Inactive"}
                </div>
                {/* Index badge */}
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  background: "rgba(0,0,0,0.45)", color: "#fff",
                  fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                }}>
                  #{index + 1}
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 2 }}>Type</div>
                  <span className={`dt-badge ${row.type == 1 ? "dt-badge-indigo" : "dt-badge-blue"}`}>
                    {row.type == 1 ? "Service" : "URL"}
                  </span>
                  {row.type == 2 && row.url && (
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {row.url}
                    </div>
                  )}
                  {row.type == 1 && row.service && (
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                      {row.service?.name || "—"}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ToggleSwitch
                    value={row.isActive}
                    onClick={() => dispatch(activeBanner(row._id))}
                  />
                  <button
                    className="act-icon act-amber"
                    title="Edit"
                    onClick={() => dispatch(openDialog({ type: "banner", data: row }))}
                  >
                    <IconEdit size={15} />
                  </button>
                  <button
                    className="act-icon act-red"
                    title="Delete"
                    onClick={() => handleDelete(row._id)}
                  >
                    <IconTrash size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialogue && dialogueType === "banner" && <BannerDialogue />}
    </div>
  );
};

Banner.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Banner;
