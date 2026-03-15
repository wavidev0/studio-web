import React, { useState } from "react";
import { useSelector } from "react-redux";
import { isSkeleton } from "@/utils/allSelector";

export default function Table(props: any) {
  const roleSkeleton = useSelector(isSkeleton);
  const { data, mapData, Page, PerPage, onChildValue, className, type } = props;
  const [sortColumn, setSortColumn] = useState<any>();
  const [sortOrder, setSortOrder] = useState<any>("asc");

  const handleColumnClick = (column: any) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedData =
    data?.length > 0
      ? [...data].sort((a: any, b: any) => {
          const vA = a[sortColumn];
          const vB = b[sortColumn];
          if (vA < vB) return sortOrder === "asc" ? -1 : 1;
          if (vA > vB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        })
      : data;

  const sliced =
    type === "client" && PerPage > 0
      ? sortedData?.slice(Page * PerPage, Page * PerPage + PerPage)
      : sortedData;

  return (
    <div className="primeMain table-custom">
      <table className={`primeTable ${className || ""}`}>
        {roleSkeleton ? (
          <tbody>
            <tr>
              <td colSpan={25} style={{ padding: 24, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                Loading...
              </td>
            </tr>
          </tbody>
        ) : (
          <>
            <thead>
              <tr>
                {mapData.map((col: any, i: number) => (
                  <th key={i} onClick={col?.thClick}>
                    {col.Header}
                    {col?.sorting?.type === "client" && (
                      <span
                        style={{ cursor: "pointer", marginLeft: 4, opacity: 0.6, fontSize: 10 }}
                        onClick={() => handleColumnClick(col.body)}
                      >⇅</span>
                    )}
                    {col?.sorting?.type === "server" && (
                      <span
                        style={{ cursor: "pointer", marginLeft: 4, opacity: 0.6, fontSize: 10 }}
                        onClick={() => onChildValue && onChildValue(col.body)}
                      >⇅</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sliced?.length > 0 ? (
                sliced.map((row: any, k: number) => (
                  <tr key={k}>
                    {mapData.map((col: any, ind: number) => (
                      <td key={ind} className={col.tdClass}>
                        {col.Cell ? <col.Cell row={row} index={k} /> : <span>{row[col?.body]}</span>}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={25} style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </>
        )}
      </table>
    </div>
  );
}
