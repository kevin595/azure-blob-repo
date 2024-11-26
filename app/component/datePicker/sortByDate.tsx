"use client";
import { format, sub } from "date-fns";
import { FC, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";

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

const SortByDate: FC = () => {
  const [selected, setSelected] = useState<DateRange | undefined>();
  // console.log(selected);

  const onOptionClick = (opt: IOption) => {
    let tempRange: DateRange | undefined = selected;

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
        tempRange = selected;
    }

    setSelected(tempRange);
  };

  return (
    <div>
      <div>
        <div style={{ padding: "1rem", backgroundColor: "#f6f6f6" }}>
          <span>Date:</span>
          <span>24 hours</span>
        </div>

        <div
          style={{
            display: "inline-flex",
            boxShadow: "0px 0px 1px 1px grey",
            borderRadius: "8px",
          }}
        >
          <div style={{ padding: "1rem 10px" }}>
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
              <span style={{ padding: "5px 10px" }}>Custom</span>
            </ul>
          </div>

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
                onSelect={(range) => setSelected(range)}
                selected={selected}
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
                    selected?.from
                      ? format(selected?.from, "dd/M/y hh:mm aaa")
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
                    selected?.to
                      ? format(selected?.to, "dd/M/y hh:mm aaa")
                      : undefined
                  }
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortByDate;
