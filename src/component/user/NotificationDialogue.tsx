import { closeDialog } from "@/store/dialogSlice";
import { allUserNotification, userNotification } from "@/store/notificationSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { Modal } from "@mui/material";
import { IconBell, IconX, IconUpload, IconAlertCircle, IconSend } from "@tabler/icons-react";
import React, { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";

const NotificationDialog = () => {
  const dispatch = useAppDispatch();
  const { dialogueData } = useSelector((state: RootStore) => state.dialogue);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState("");
  const [error, setError] = useState<any>({});
  const [dragging, setDragging] = useState(false);

  const isAllUser = dialogueData == null;
  const heading = isAllUser ? "Notify All Users" : "Send Notification";
  const subheading = isAllUser ? "Broadcast to all users" : `To: ${dialogueData?.name || "User"}`;

  const handleFile = (file: File) => {
    setImage(file);
    setImagePath(URL.createObjectURL(file));
    setError((e: any) => ({ ...e, image: "" }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const validate = () => {
    const err: any = {};
    if (!title) err.title = "Title is required";
    if (!message) err.message = "Message is required";
    if (Object.keys(err).length) { setError(err); return false; }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (!isAllUser) {
      if (image) {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("message", message);
        fd.append("image", image);
        dispatch(userNotification({ formData: fd, userId: dialogueData.id })).unwrap();
      } else {
        dispatch(userNotification({ data: { title, message, userId: dialogueData.id }, userId: dialogueData.id })).unwrap();
      }
    } else {
      if (image) {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("message", message);
        fd.append("image", image);
        dispatch(allUserNotification(fd)).unwrap();
      } else {
        dispatch(allUserNotification({ data: { title, message } })).unwrap();
      }
    }
    dispatch(closeDialog());
  };

  const inp = (hasError: boolean): React.CSSProperties => ({
    width: "100%", padding: "9px 12px", borderRadius: 9, fontSize: 13,
    border: `1.5px solid ${hasError ? "#EF4444" : "#E5E7EB"}`,
    background: hasError ? "#FFF5F5" : "#F9FAFB",
    outline: "none", boxSizing: "border-box", color: "#111827",
  });

  return (
    <Modal open={true} onClose={() => dispatch(closeDialog())}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)", outline: "none", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#EEF2FF", borderRadius: 8, padding: 8, display: "flex" }}>
              <IconBell size={18} color="#6366F1" />
            </div>
            <div>
              <h6 style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{heading}</h6>
              <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{subheading}</p>
            </div>
          </div>
          <button onClick={() => dispatch(closeDialog())}
            style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}>
            <IconX size={16} color="#6B7280" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Title */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Title</label>
            <input
              type="text" value={title} placeholder="e.g. New Offer Available"
              style={inp(!!error.title)}
              onChange={(e) => { setTitle(e.target.value); setError((p: any) => ({ ...p, title: "" })); }}
            />
            {error.title && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444", display: "flex", alignItems: "center", gap: 4 }}><IconAlertCircle size={11} />{error.title}</p>}
          </div>

          {/* Message */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Message</label>
            <textarea
              value={message} placeholder="Write your notification message..."
              rows={3}
              style={{ ...inp(!!error.message), resize: "none" }}
              onChange={(e) => { setMessage(e.target.value); setError((p: any) => ({ ...p, message: "" })); }}
            />
            {error.message && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444", display: "flex", alignItems: "center", gap: 4 }}><IconAlertCircle size={11} />{error.message}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Image (optional)</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("notifImageInput")?.click()}
              style={{
                border: `2px dashed ${dragging ? "#6366F1" : "#E5E7EB"}`,
                borderRadius: 10, cursor: "pointer",
                background: dragging ? "#EEF2FF" : "#FAFAFA",
                overflow: "hidden", position: "relative",
                transition: "all 0.15s",
              }}
            >
              {imagePath ? (
                <div style={{ position: "relative" }}>
                  <img src={imagePath} alt="preview" style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                  <div style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Click to change</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "20px 16px", textAlign: "center" }}>
                  <IconUpload size={24} color="#9CA3AF" style={{ marginBottom: 6 }} />
                  <p style={{ margin: 0, fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Drag & drop or click to upload</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9CA3AF" }}>PNG, JPG supported</p>
                </div>
              )}
            </div>
            <input id="notifImageInput" type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={() => dispatch(closeDialog())}
            style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 20px", borderRadius: 8, border: "none",
              background: "#6366F1",
              color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
            <IconSend size={14} />
            {isAllUser ? "Notify All" : "Send"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationDialog;
