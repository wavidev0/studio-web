import dayjs from "dayjs";
import moment from "moment";
import { useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { IconCalendar, IconChevronDown, IconX } from "@tabler/icons-react";

export default function Analytics(props: any) {
  const { analyticsStartDate, analyticsStartEnd, analyticsStartDateSet, analyticsStartEndSet, direction } = props;

  const [state, setState] = useState({
    start: moment().subtract(29, "days"),
    end: moment(),
  });

  const isAll =
    !analyticsStartDate ||
    !analyticsStartEnd ||
    (analyticsStartDate?.toUpperCase?.() === "ALL" && analyticsStartEnd?.toUpperCase?.() === "ALL");

  const displayLabel = isAll
    ? null
    : `${moment(analyticsStartDate).format("DD MMM YYYY")}  –  ${moment(analyticsStartEnd).format("DD MMM YYYY")}`;

  const handleApply = (_: any, picker: any) => {
    const start = dayjs(picker.startDate).format("YYYY-MM-DD");
    const end = dayjs(picker.endDate).format("YYYY-MM-DD");
    analyticsStartDateSet(start);
    analyticsStartEndSet(end);
    setState({ start: picker.startDate, end: picker.endDate });
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    analyticsStartDateSet("ALL");
    analyticsStartEndSet("ALL");
  };

  return (
    <div style={{ display: "flex", justifyContent: direction || "flex-end" }}>
      <DateRangePicker
        initialSettings={{
          startDate: state.start.toDate(),
          endDate: state.end.toDate(),
          maxDate: new Date(),
          ranges: {
            Today: [moment().toDate(), moment().toDate()],
            Yesterday: [moment().subtract(1, "days").toDate(), moment().subtract(1, "days").toDate()],
            "Last 7 Days": [moment().subtract(6, "days").toDate(), moment().toDate()],
            "Last 30 Days": [moment().subtract(29, "days").toDate(), moment().toDate()],
            "This Month": [moment().startOf("month").toDate(), moment().endOf("month").toDate()],
            "Last Month": [moment().subtract(1, "month").startOf("month").toDate(), moment().subtract(1, "month").endOf("month").toDate()],
            "All Time": [new Date("1970-01-01"), dayjs().toDate()],
          },
        }}
        onApply={handleApply}
        onCallback={(s: any, e: any) => setState({ start: s, end: e })}
      >
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 10,
            border: displayLabel ? "1.5px solid #6366F1" : "1.5px solid #E5E7EB",
            background: displayLabel ? "#EEF2FF" : "#fff",
            cursor: "pointer",
            minWidth: 210,
            userSelect: "none",
            transition: "all 0.15s",
            outline: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          {/* Calendar icon */}
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: 7,
            background: displayLabel ? "#C7D2FE" : "#F3F4F6",
            flexShrink: 0,
          }}>
            <IconCalendar size={15} color={displayLabel ? "#4338CA" : "#6B7280"} />
          </span>

          {/* Label */}
          <span style={{
            flex: 1,
            fontSize: 13,
            fontWeight: displayLabel ? 600 : 400,
            color: displayLabel ? "#4338CA" : "#9CA3AF",
            textAlign: "left",
            whiteSpace: "nowrap",
          }}>
            {displayLabel || "Select date range"}
          </span>

          {/* Clear or chevron */}
          {displayLabel ? (
            <span
              onClick={handleClear}
              style={{ display: "flex", alignItems: "center", padding: 2, borderRadius: 4, cursor: "pointer" }}
            >
              <IconX size={13} color="#6366F1" />
            </span>
          ) : (
            <IconChevronDown size={14} color="#9CA3AF" />
          )}
        </button>
      </DateRangePicker>
    </div>
  );
}
