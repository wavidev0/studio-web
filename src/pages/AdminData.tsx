import { useSelector } from "react-redux";
import { RootStore, useAppDispatch } from "@/store/store";
import { ChangeEvent, useEffect, useState } from "react";
import { adminProfileGet, adminProfileUpdate, updateAdminPassword } from "@/store/adminSlice";
import RootLayout from "@/component/layout/Layout";
import { IconUser, IconMail, IconLock, IconEye, IconEyeOff, IconCamera, IconDeviceFloppy, IconKey } from "@tabler/icons-react";

const AdminData = () => {
  const dispatch = useAppDispatch();
  const { admin } = useSelector((state: RootStore) => state.admin);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [image, setImage] = useState<File | undefined>();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileError, setProfileError] = useState<any>({});
  const [passError, setPassError] = useState<any>({});

  useEffect(() => { dispatch(adminProfileGet()); }, []);

  useEffect(() => {
    if (admin) {
      setName(admin.name || "");
      setEmail(admin.email || "");
      setImagePath(admin.image || "");
    }
  }, [admin]);

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePath(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append("image", file);
    dispatch(adminProfileUpdate(fd));
  };

  const handleEditProfile = () => {
    const err: any = {};
    if (!name) err.name = "Name is required";
    if (!email) err.email = "Email is required";
    if (Object.keys(err).length) return setProfileError(err);
    const fd = new FormData();
    if (image) fd.append("image", image);
    fd.append("name", name);
    fd.append("email", email);
    dispatch(adminProfileUpdate(fd));
    setProfileError({});
  };

  const handleChangePassword = () => {
    const err: any = {};
    if (!oldPassword) err.oldPassword = "Required";
    if (!newPassword) err.newPassword = "Required";
    if (!confirmPassword) err.confirmPassword = "Required";
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      err.confirmPassword = "Passwords don't match";
    if (Object.keys(err).length) return setPassError(err);
    dispatch(updateAdminPassword({ oldPass: oldPassword, newPass: newPassword, confirmPass: confirmPassword }));
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    setPassError({});
  };

  const inp = (hasError: boolean): React.CSSProperties => ({
    width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8, fontSize: 13,
    border: `1.5px solid ${hasError ? "#EF4444" : "#E5E7EB"}`,
    background: "#fff", outline: "none", boxSizing: "border-box", color: "#111827",
  });

  const iconWrap: React.CSSProperties = {
    position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none",
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden",
      }}>

        {/* ── Top banner + avatar ── */}
        <div style={{ background: "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)", height: 110, position: "relative" }}>
          <div style={{ position: "absolute", bottom: -44, left: 32 }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={imagePath || `/images/user.jpg`}
                onError={(e: any) => { e.target.src = `/images/user.jpg`; }}
                alt="Admin"
                style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: "4px solid #fff", boxShadow: "0 2px 10px rgba(0,0,0,0.15)", display: "block" }}
              />
              <label htmlFor="avatarInput" style={{
                position: "absolute", bottom: 2, right: 2,
                background: "#6366F1", borderRadius: "50%", width: 26, height: 26,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: "2px solid #fff",
              }}>
                <IconCamera size={13} color="#fff" />
              </label>
              <input id="avatarInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handleUploadImage} />
            </div>
          </div>
        </div>

        {/* ── Name / role ── */}
        <div style={{ padding: "52px 32px 0" }}>
          <h5 style={{ margin: 0, fontWeight: 700, fontSize: 17, color: "#111827" }}>{admin?.name || "Admin"}</h5>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9CA3AF" }}>{admin?.email}</p>
          <span style={{ display: "inline-block", marginTop: 6, background: "#EEF2FF", color: "#6366F1", fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 20 }}>
            Administrator
          </span>
        </div>

        {/* ── Divider ── */}
        <div style={{ margin: "24px 32px 0", borderTop: "1px solid #F3F4F6" }} />

        {/* ── Two sections side by side ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>

          {/* Edit Profile */}
          <div style={{ padding: "24px 32px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <IconUser size={16} color="#6366F1" />
              <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>Edit Profile</span>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 5, display: "block" }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><IconUser size={14} /></span>
                <input type="text" value={name} placeholder="Enter name"
                  onChange={(e) => { setName(e.target.value); setProfileError((p: any) => ({ ...p, name: "" })); }}
                  style={inp(!!profileError.name)} />
              </div>
              {profileError.name && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{profileError.name}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 5, display: "block" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><IconMail size={14} /></span>
                <input type="email" value={email} placeholder="Enter email"
                  onChange={(e) => { setEmail(e.target.value); setProfileError((p: any) => ({ ...p, email: "" })); }}
                  style={inp(!!profileError.email)} />
              </div>
              {profileError.email && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{profileError.email}</p>}
            </div>

            <button onClick={handleEditProfile} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              width: "100%", padding: "10px", borderRadius: 9, border: "none",
              background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              <IconDeviceFloppy size={15} /> Save Changes
            </button>
          </div>

          {/* Vertical divider */}
          <div style={{ borderLeft: "1px solid #F3F4F6", padding: "24px 32px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <IconKey size={16} color="#6366F1" />
              <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>Change Password</span>
            </div>

            {[
              { label: "Old Password", value: oldPassword, set: setOldPassword, show: showOld, toggle: () => setShowOld(!showOld), err: passError.oldPassword, key: "oldPassword" },
              { label: "New Password", value: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew), err: passError.newPassword, key: "newPassword" },
              { label: "Confirm Password", value: confirmPassword, set: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(!showConfirm), err: passError.confirmPassword, key: "confirmPassword" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 5, display: "block" }}>{f.label}</label>
                <div style={{ position: "relative" }}>
                  <span style={iconWrap}><IconLock size={14} /></span>
                  <input
                    type={f.show ? "text" : "password"}
                    value={f.value}
                    placeholder={f.label}
                    onChange={(e) => { f.set(e.target.value); setPassError((p: any) => ({ ...p, [f.key]: "" })); }}
                    style={{ ...inp(!!f.err), paddingRight: 36 }}
                  />
                  <span onClick={f.toggle} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#9CA3AF" }}>
                    {f.show ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                  </span>
                </div>
                {f.err && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{f.err}</p>}
              </div>
            ))}

            <button onClick={handleChangePassword} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              width: "100%", padding: "10px", borderRadius: 9, border: "none",
              background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 10,
            }}>
              <IconKey size={15} /> Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AdminData.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default AdminData;
