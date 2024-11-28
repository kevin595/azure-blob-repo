"use client";
import { FC, useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { SortPopOver } from "./sortPopOver";

export interface ISortByDateProps {
  dateRange?: DateRange;
  onDateRangeChange: (range?: DateRange) => void;
  label?: string;
  onLabelChange: (val?: string) => void;
}

const SortByDate: FC<ISortByDateProps> = ({
  dateRange,
  label,
  onDateRangeChange,
  onLabelChange,
}) => {
  const [isOpenState, setIsOpenState] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        event.target &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpenState(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div>
      <div ref={popupRef} style={{ position: "relative", width: "9rem" }}>
        <div
          style={{
            padding: "2px 4px",
            backgroundColor: "#f6f6f6",
            border: "1px solid black ",
          }}
          onClick={() => setIsOpenState(true)}
        >
          {label && (
            <>
              <span>Date:</span>
              <span>{label}</span>
            </>
          )}
        </div>

        {isOpenState && (
          <div
            style={{
              position: "absolute",
              marginTop: "4px",
              minWidth: "max-content",
              background: "white",
            }}
          >
            <SortPopOver
              onClose={() => setIsOpenState(false)}
              onDateRangeChange={onDateRangeChange}
              onLabelChange={onLabelChange}
              dateRange={dateRange}
              label={label}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SortByDate;
