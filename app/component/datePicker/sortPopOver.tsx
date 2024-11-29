import { FC, useState } from "react";
import { ISortByDateProps } from "./sortByDate";
import { DateRange, DayPicker } from "react-day-picker";
import { format, sub } from "date-fns";

export interface IOption {
  name: string;
  label: string;
}

export const calenderOptions: IOption[] = [
  { name: "Last30min", label: "Last 30min" },
  { name: "Last-hour", label: "Last hour" },
  { name: "Last4hour", label: "Last 4 hour" },
  { name: "Last8hour", label: "Last 8 hour" },
  { name: "Last12hour", label: "Last 12 hour" },
  { name: "Last24hour", label: "Last 24 hour" },
  { name: "Last48hour", label: "Last 48 hour" },
  { name: "Last3days", label: "Last 3 days" },
  { name: "Last7days", label: "Last 7 days" },
];

export enum optionEnum {
  custom = "Custom",
}

export interface ISortPopOverProps extends ISortByDateProps {
  onClose: () => void;
}

export const SortPopOver: FC<ISortPopOverProps> = ({
  dateRange,
  onDateRangeChange,
  onLabelChange,
  onClose,
  label,
}) => {
  const [isCalenderOpenState, setIsCalenderOpenState] = useState(
    optionEnum.custom === label
  );
  const [rangeState, setRangeState] = useState<DateRange | undefined>(
    dateRange
  );

  const onOptionClick = (opt: IOption) => {
    let tempRange: DateRange | undefined = dateRange;

    switch (opt.name) {
      case "Last30min":
        tempRange = {
          from: sub(new Date(), {
            minutes: 30,
            seconds: 0,
          }),
          to: new Date(),
        };
        break;
      case "Last-hour":
        tempRange = {
          from: sub(new Date(), {
            hours: 1,
            minutes: 0,
            seconds: 0,
          }),
          to: new Date(),
        };
        break;

      case "Last4hour":
        tempRange = {
          from: sub(new Date(), {
            hours: 4,
            minutes: 0,
            seconds: 0,
          }),
          to: new Date(),
        };
        break;

      case "Last8hour":
        tempRange = {
          from: sub(new Date(), {
            hours: 8,
            minutes: 0,
            seconds: 0,
          }),
          to: new Date(),
        };
        break;

      case "Last12hour":
        tempRange = {
          from: sub(new Date(), {
            hours: 12,
            minutes: 0,
            seconds: 0,
          }),
          to: new Date(),
        };
        break;

      case "Last24hour":
        tempRange = {
          from: sub(new Date(), {
            hours: 24,
            minutes: 0,
            seconds: 0,
          }),
          to: new Date(),
        };
        break;

      case "Last48hour":
        tempRange = {
          from: sub(new Date(), {
            hours: 48,
            minutes: 0,
            seconds: 0,
          }),
          to: new Date(),
        };
        break;

      case "Last3days":
        tempRange = {
          from: sub(new Date(), {
            days: 3,
            hours: 0,
            minutes: 0,
            seconds: 0,
          }),
          to: new Date(),
        };
        break;

      case "Last7days":
        tempRange = {
          from: sub(new Date(), {
            days: 7,
            hours: 0,
            minutes: 0,
            seconds: 0,
          }),
          to: new Date(),
        };
        break;

      default:
        tempRange = dateRange;
    }

    onDateRangeChange(tempRange);
    onLabelChange(opt.label);
    onClose();
  };
  return (
    <div
      style={{
        display: "inline-flex",
        boxShadow: "0px 0px 1px 1px grey",
        borderRadius: "8px",
      }}
    >
      <div style={{ padding: "1rem 10px", minWidth: "fit-content" }}>
        <ul>
          {calenderOptions.map((obj) => (
            <li key={obj.name}>
              <div
                onClick={() => onOptionClick(obj)}
                style={{ padding: "5px 10px" }}
              >
                {obj.label}
              </div>
            </li>
          ))}
        </ul>
        <ul>
          <span
            style={{ padding: "5px 10px" }}
            onClick={() => setIsCalenderOpenState(true)}
          >
            {optionEnum.custom}
          </span>
        </ul>
      </div>

      {isCalenderOpenState && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid grey",
          }}
        >
          <div>
            <DayPicker
              captionLayout="buttons"
              mode="range"
              numberOfMonths={2}
              onSelect={(range) => setRangeState(range)}
              selected={rangeState}
            />
          </div>
          <div
            style={{
              display: "flex",
              padding: "15px 20px 0",
              borderTop: "1px solid grey",
            }}
          >
            <div>
              <input
                value={
                  rangeState?.from
                    ? format(rangeState?.from, "dd/M/y hh:mm aaa")
                    : undefined
                }
                readOnly
              />
            </div>
            <div style={{ margin: "0 1rem" }}>
              <span>-</span>
            </div>
            <div>
              <input
                value={
                  rangeState?.to
                    ? format(rangeState?.to, "dd/M/y hh:mm aaa")
                    : undefined
                }
                readOnly
              />
            </div>
            <div>
              <button
                style={{ marginRight: "1rem" }}
                onClick={() => {
                  onDateRangeChange(undefined);
                  onClose();
                  onLabelChange("");
                }}
              >
                clear
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  onDateRangeChange(rangeState);
                  onLabelChange(optionEnum.custom);
                  onClose();
                }}
              >
                apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
