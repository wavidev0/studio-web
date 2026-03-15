import { createCoupon } from "@/store/couponSlice";
import { closeDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { Modal } from "@mui/material";
import { IconTicket, IconX, IconAlertCircle, IconCurrencyDollar, IconPercentage, IconCalendar, IconTag, IconWallet, IconClockHour4 } from "@tabler/icons-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const field = (label: string, error: string, children: React.ReactNode, icon?: React.ReactNode) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>
      {icon}{label}
    </label>
    {children}
    {error && <p style={{ margin: 0, fontSize: 11, color: "#EF4444", display: "flex", alignItems: "center", gap: 4 }}><IconAlertCircle size={11} />{error}</p>}
  </div>
);

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none",
  border: `1.5px solid ${hasError ? "#EF4444" : "#E5E7EB"}`,
  background: hasError ? "#FFF5F5" : "#fff", boxSizing: "border-box", transition: "border 0.15s",
});

const CouponDialogue = () => {
  const dispatch = useAppDispatch();
  const { dialogueData } = useSelector((state: RootStore) => state.dialogue);

  const [title, setTitle] = useState("");
  const [prefix, setPrefix] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [minAmountToApply, setMinAmountToApply] = useState("");
  const [couponType, setCouponType] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [error, setError] = useState<any>({});

  const setErr = (key: string, val: string) => setError((e: any) => ({ ...e, [key]: val }));

  const handleSubmit = () => {
    const err: any = {};
    if (!title) err.title = "Title is required";
    if (!prefix) err.prefix = "Prefix is required";
    if (!description) err.description = "Description is required";
    if (!expiryDate) err.expiryDate = "Expiry date is required";
    if (!couponType) err.couponType = "Coupon type is required";
    if (!discountType) err.discountType = "Discount type is required";
    if (!minAmountToApply) err.minAmountToApply = "Min amount is required";
    if (discountType == "1" && !maxDiscount) err.maxDiscount = "Max discount is required";
    if (discountType == "2" && !discountPercent) err.discountPercent = "Discount % is required";
    if (discountType == "2" && Number(discountPercent) > 99) err.discountPercent = "Must be between 0–99";
    if (Object.keys(err).length) return setError(err);

    dispatch(createCoupon({ title, prefix, description, expiryDate, type: couponType, discountType, maxDiscount, discountPercent, minAmountToApply }));
    dispatch(closeDialog());
  };

  return (
    <Modal open={true} onClose={() => dispatch(closeDialog())}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 580,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)", outline: "none", overflow: "hidden",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#EEF2FF", borderRadius: 8, padding: 8, display: "flex" }}>
              <IconTicket size={18} color="#6366F1" />
            </div>
            <div>
              <h6 style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Create Coupon</h6>
              <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>Not editable after creation — fill carefully</p>
            </div>
          </div>
          <button onClick={() => dispatch(closeDialog())} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}>
            <IconX size={16} color="#6B7280" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Row 1 — Title & Prefix */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Title", error.title, (
              <input style={inputStyle(!!error.title)} placeholder="e.g. Summer Sale" value={title}
                onChange={(e) => { setTitle(e.target.value); setErr("title", e.target.value ? "" : "Title is required"); }} />
            ), <IconTag size={13} color="#6366F1" />)}

            {field("Prefix", error.prefix, (
              <input style={inputStyle(!!error.prefix)} placeholder="e.g. FREETIER" value={prefix}
                onChange={(e) => { setPrefix(e.target.value.toUpperCase()); setErr("prefix", e.target.value ? "" : "Prefix is required"); }} />
            ), <IconTicket size={13} color="#6366F1" />)}
          </div>

          {/* Row 2 — Description */}
          {field("Description", error.description, (
            <input style={inputStyle(!!error.description)} placeholder="Short description of this coupon" value={description}
              onChange={(e) => { setDescription(e.target.value); setErr("description", e.target.value ? "" : "Description is required"); }} />
          ))}

          {/* Row 3 — Coupon Type & Discount Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Coupon Type", error.couponType, (
              <div style={{ display: "flex", gap: 8 }}>
                {[{ v: "1", label: "Wallet", icon: <IconWallet size={13} /> }, { v: "2", label: "Booking", icon: <IconClockHour4 size={13} /> }].map((t) => (
                  <button key={t.v} onClick={() => { setCouponType(t.v); setErr("couponType", ""); }}
                    style={{ flex: 1, padding: "8px 10px", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.15s", border: couponType === t.v ? "2px solid #6366F1" : "2px solid #E5E7EB", background: couponType === t.v ? "#EEF2FF" : "#fff", color: couponType === t.v ? "#6366F1" : "#6B7280" }}>
                    {t.icon}{t.label}
                  </button>
                ))}
              </div>
            ))}

            {field("Discount Type", error.discountType, (
              <div style={{ display: "flex", gap: 8 }}>
                {[{ v: "1", label: "Flat", icon: <IconCurrencyDollar size={13} /> }, { v: "2", label: "Percent", icon: <IconPercentage size={13} /> }].map((t) => (
                  <button key={t.v} onClick={() => { setDiscountType(t.v); setErr("discountType", ""); }}
                    style={{ flex: 1, padding: "8px 10px", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.15s", border: discountType === t.v ? "2px solid #6366F1" : "2px solid #E5E7EB", background: discountType === t.v ? "#EEF2FF" : "#fff", color: discountType === t.v ? "#6366F1" : "#6B7280" }}>
                    {t.icon}{t.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Row 4 — Min Amount & Expiry */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Min Amount to Apply", error.minAmountToApply, (
              <input type="number" style={inputStyle(!!error.minAmountToApply)} placeholder="e.g. 100" value={minAmountToApply}
                onChange={(e) => { setMinAmountToApply(e.target.value); setErr("minAmountToApply", e.target.value ? "" : "Min amount is required"); }} />
            ), <IconCurrencyDollar size={13} color="#6366F1" />)}

            {field("Expiry Date", error.expiryDate, (
              <input type="date" style={inputStyle(!!error.expiryDate)} value={expiryDate}
                onChange={(e) => { setExpiryDate(e.target.value); setErr("expiryDate", e.target.value ? "" : "Expiry date is required"); }} />
            ), <IconCalendar size={13} color="#6366F1" />)}
          </div>

          {/* Row 5 — Max Discount / Percent */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Max Discount", error.maxDiscount, (
              <input type="number" style={inputStyle(!!error.maxDiscount)} placeholder="e.g. 50" value={maxDiscount}
                onChange={(e) => { setMaxDiscount(e.target.value); setErr("maxDiscount", e.target.value ? "" : "Max discount is required"); }} />
            ), <IconCurrencyDollar size={13} color="#6366F1" />)}

            {discountType === "2" && field("Discount Percent (%)", error.discountPercent, (
              <input type="number" style={inputStyle(!!error.discountPercent)} placeholder="e.g. 20" value={discountPercent} min={0} max={99}
                onChange={(e) => { setDiscountPercent(e.target.value); setErr("discountPercent", !e.target.value ? "Required" : Number(e.target.value) > 99 ? "Must be 0–99" : ""); }} />
            ), <IconPercentage size={13} color="#6366F1" />)}
          </div>

          {/* Warning note */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 14px" }}>
            <IconAlertCircle size={15} color="#D97706" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#92400E", fontWeight: 500 }}>This coupon cannot be edited after creation. Please review all fields carefully.</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
          <button onClick={() => dispatch(closeDialog())}
            style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Create Coupon
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CouponDialogue;
