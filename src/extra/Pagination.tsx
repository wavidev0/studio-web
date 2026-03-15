import React, { useEffect, useState } from "react";

const Pagination = (props: any) => {
  const [pages, setPages] = useState<any[]>([]);
  const {
    type,
    serverPage,
    serverPerPage,
    onPageChange,
    onRowsPerPageChange,
    clientPage,
    setCurrentPage,
    totalData,
  } = props;

  const totalPages = Math.ceil(totalData / serverPerPage);

  useEffect(() => {
    const range = Math.min(3, totalPages);
    const start = Math.max(1, (clientPage || 0) - Math.floor(range / 2));
    const end = Math.min(start + range - 1, totalPages);
    setPages(Array.from({ length: end - start + 1 }, (_, i) => start + i));
  }, [clientPage, totalPages]);

  const start = serverPage * serverPerPage + 1;
  const end = Math.min((serverPage + 1) * serverPerPage, totalData);

  const btnStyle: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 6, border: "1px solid #E5E7EB",
    background: "#fff", cursor: "pointer", display: "inline-flex",
    alignItems: "center", justifyContent: "center", fontSize: 13,
    color: "#374151", transition: "background 0.15s, border-color 0.15s",
    fontFamily: "Inter, sans-serif",
  };

  const disabledStyle: React.CSSProperties = { ...btnStyle, opacity: 0.35, cursor: "not-allowed" };

  if (!totalData || totalData === 0) return null;

  return (
    <div style={{ background: "#fff", borderTop: "1px solid #F3F4F6", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      {/* Left: rows per page */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12.5, color: "#6B7280" }}>Rows per page:</span>
        <select
          onChange={(e) => onRowsPerPageChange(e.target.value)}
          style={{ height: 32, border: "1px solid #E5E7EB", borderRadius: 6, background: "#F9FAFB", fontSize: 12.5, padding: "0 8px", color: "#374151", outline: "none", cursor: "pointer" }}
        >
          {[5, 10, 25, 50, 100].map(v => (
            <option key={v} value={v} selected={v === serverPerPage}>{v}</option>
          ))}
          <option value={totalData}>All</option>
        </select>
      </div>

      {/* Right: nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12.5, color: "#6B7280", marginRight: 8 }}>
          <strong style={{ color: "#111827" }}>{start}</strong>–<strong style={{ color: "#111827" }}>{end}</strong> of <strong style={{ color: "#111827" }}>{totalData}</strong>
        </span>
        <button style={serverPage === 0 ? disabledStyle : btnStyle} disabled={serverPage === 0} onClick={(e) => onPageChange(e, 0)}>«</button>
        <button style={serverPage === 0 ? disabledStyle : btnStyle} disabled={serverPage === 0} onClick={(e) => onPageChange(e, serverPage - 1)}>‹</button>
        <button style={serverPage >= totalPages - 1 ? disabledStyle : btnStyle} disabled={serverPage >= totalPages - 1} onClick={(e) => onPageChange(e, serverPage + 1)}>›</button>
        <button style={serverPage >= totalPages - 1 ? disabledStyle : btnStyle} disabled={serverPage >= totalPages - 1} onClick={(e) => onPageChange(e, totalPages - 1)}>»</button>
      </div>
    </div>
  );
};

export default Pagination;
