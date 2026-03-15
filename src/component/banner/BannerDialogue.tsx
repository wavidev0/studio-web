import { createBanner, updatedBanner } from "@/store/bannerSlice";
import { closeDialog } from "@/store/dialogSlice";
import { getServices } from "@/store/serviceSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { Modal } from "@mui/material";
import { IconPhoto, IconX, IconUpload, IconLink, IconTag } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BannerDialogue = () => {
  const dispatch = useAppDispatch();
  const { dialogueData } = useSelector((state: RootStore) => state.dialogue);
  const { service } = useSelector((state: RootStore) => state.service);

  const [image, setImage] = useState<any>("");
  const [imagePath, setImagePath] = useState<any>("");
  const [type, setType] = useState<any>("");
  const [serviceId, setServiceId] = useState<any>("");
  const [url, setUrl] = useState<any>("");
  const [error, setError] = useState({ image: "", type: "", serviceId: "", url: "" });
  const [dragging, setDragging] = useState(false);

  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  useEffect(() => {
    dispatch(getServices({ start: 0, limit: 100, search: "ALL" }));
  }, []);

  useEffect(() => {
    if (dialogueData) {
      setImagePath(dialogueData?.image || "");
      setImage(dialogueData?.image || "");
      setType(dialogueData?.type || "");
      setServiceId(dialogueData?.service?._id || dialogueData?.service || "");
      setUrl(dialogueData?.url || "");
    }
  }, [dialogueData]);

  const handleFile = (file: File) => {
    if (!file) return;
    setImage(file);
    setImagePath(URL.createObjectURL(file));
    setError((e) => ({ ...e, image: "" }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    let err = { image: "", type: "", serviceId: "", url: "" };
    if (!image) err.image = "Image is required";
    if (!type) err.type = "Type is required";
    if (type == 1 && !serviceId) err.serviceId = "Service is required";
    if (type == 2 && !url) err.url = "URL is required";
    if (type == 2 && url && !urlRegex.test(url)) err.url = "Invalid URL format";
    if (err.image || err.type || err.serviceId || err.url) return setError(err);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("type", type);
    if (type == 1) formData.append("serviceId", serviceId);
    else formData.append("url", url);

    if (dialogueData) {
      dispatch(updatedBanner({ id: dialogueData._id, formData }));
    } else {
      dispatch(createBanner(formData));
    }
    dispatch(closeDialog());
  };

  return (
    <Modal open={true} onClose={() => dispatch(closeDialog())}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)", outline: "none", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#EEF2FF", borderRadius: 8, padding: 8, display: "flex" }}>
              <IconPhoto size={18} color="#6366F1" />
            </div>
            <div>
              <h6 style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{dialogueData ? "Edit Banner" : "Add Banner"}</h6>
              <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>Recommended size: 1600×400px</p>
            </div>
          </div>
          <button onClick={() => dispatch(closeDialog())} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}>
            <IconX size={16} color="#6B7280" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Image Upload */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>Banner Image</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("bannerImageInput")?.click()}
              style={{
                border: `2px dashed ${dragging ? "#6366F1" : error.image ? "#EF4444" : "#E5E7EB"}`,
                borderRadius: 12, padding: imagePath ? 0 : "28px 16px",
                textAlign: "center", cursor: "pointer", background: dragging ? "#EEF2FF" : "#FAFAFA",
                transition: "all 0.2s", overflow: "hidden", position: "relative",
              }}
            >
              {imagePath ? (
                <>
                  <img src={imagePath} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                  <div style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Click to change</span>
                  </div>
                </>
              ) : (
                <>
                  <IconUpload size={28} color="#9CA3AF" style={{ marginBottom: 8 }} />
                  <p style={{ margin: 0, fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Drag & drop or click to upload</p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9CA3AF" }}>PNG, JPG supported</p>
                </>
              )}
            </div>
            <input id="bannerImageInput" type="file" accept="image/png,image/jpeg" style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {error.image && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>{error.image}</p>}
          </div>

          {/* Type Select */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <IconTag size={14} /> Banner Type
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {[{ value: "1", label: "Service", icon: <IconTag size={14} /> }, { value: "2", label: "URL", icon: <IconLink size={14} /> }].map((t) => (
                <button key={t.value} onClick={() => { setType(t.value); setError((e) => ({ ...e, type: "" })); }}
                  style={{
                    flex: 1, padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s",
                    border: type == t.value ? "2px solid #6366F1" : "2px solid #E5E7EB",
                    background: type == t.value ? "#EEF2FF" : "#fff",
                    color: type == t.value ? "#6366F1" : "#6B7280",
                  }}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>
            {error.type && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>{error.type}</p>}
          </div>

          {/* Service or URL */}
          {type == 1 && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>Select Service</label>
              <select
                className="form-select"
                value={serviceId}
                onChange={(e) => { setServiceId(e.target.value); setError((err) => ({ ...err, serviceId: "" })); }}
                style={{ borderRadius: 10, fontSize: 13, padding: "10px 12px", border: error.serviceId ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB" }}
              >
                <option value="" disabled>-- Select Service --</option>
                {service?.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              {error.serviceId && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>{error.serviceId}</p>}
            </div>
          )}

          {type == 2 && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <IconLink size={14} /> URL
              </label>
              <input
                type="text"
                value={url}
                placeholder="https://example.com"
                onChange={(e) => { setUrl(e.target.value); setError((err) => ({ ...err, url: "" })); }}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 13, outline: "none",
                  border: error.url ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB", boxSizing: "border-box",
                }}
              />
              {error.url && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>{error.url}</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={() => dispatch(closeDialog())}
            style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {dialogueData ? "Update Banner" : "Add Banner"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BannerDialogue;
