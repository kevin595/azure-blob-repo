import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";

export interface IDropdownOption {
  id: string | number;
  label: string;
}

export interface ICustomDropDownProps {
  options?: IDropdownOption[];
}

const demoOptionList: IDropdownOption[] = [
  {
    id: 1,
    label: "option-1",
  },
  {
    id: 2,
    label: "option-2",
  },
  {
    id: 3,
    label: "option-3",
  },
  {
    id: 4,
    label: "option-4",
  },
];

const CustomDropDown: FC<ICustomDropDownProps> = ({
  options = demoOptionList,
}) => {
  const [showOptionState, setShowOptionState] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const [selectedListState, setSelectedListState] = useState<IDropdownOption[]>(
    []
  );
  const [optionsState, setOptionsState] = useState<IDropdownOption[]>(options);

  useEffect(() => {
    const handleDropdownClick = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        event.target &&
        dropDownRef.current.contains(event.target as Node)
      ) {
        setShowOptionState(true);
      } else {
        setShowOptionState(false);
        setOptionsState([...options]);
        if (inputRef.current) inputRef.current.value = "";
      }
    };

    document.addEventListener("mousedown", handleDropdownClick);
    return () => {
      document.removeEventListener("mousedown", handleDropdownClick);
    };
  }, []);

  const isOptionSelected = (opt: IDropdownOption) => {
    let isSelected = false;
    selectedListState.map((obj) => {
      if (obj.id === opt.id) {
        isSelected = true;
      }
    });
    return isSelected;
  };

  const getOptions = () => {
    if (optionsState.length === 0) {
      return <li style={{ padding: "0 0 0 5px" }}>No options available</li>;
    }
    return (
      <>
        {optionsState.map((opt, indx) => {
          const isSelected = isOptionSelected(opt);

          return (
            <li
              key={opt.id}
              style={{ padding: "0 0 0 5px" }}
              onClick={() => onSelectClick(indx, isSelected)}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>{opt.label}</div>
                {isSelected ? getTick() : null}
              </div>
            </li>
          );
        })}
      </>
    );
  };

  const onSelectClick = (indx: number, isSelected?: boolean) => {
    console.log("onslect", isSelected);
    if (!isSelected) {
      setSelectedListState([...selectedListState, optionsState[indx]]);
    }
  };

  const onSearch = (value: string) => {
    console.log("val", value);
    if (value) {
      const tempOptions = options.filter((obj) =>
        obj.label.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      );
      console.log("tempop", tempOptions);
      setOptionsState([...tempOptions]);
    } else {
      setOptionsState([...options]);
    }
  };

  const debounceSearch = (val: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => onSearch(val), 200);
  };

  const onBackSpace = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.code === "Backspace" &&
      inputRef.current &&
      !inputRef.current.value &&
      selectedListState.length > 0
    ) {
      selectedListState.splice(selectedListState.length - 1, 1);
      setSelectedListState([...selectedListState]);
    }
  };

  const onRemove = (indx: number) => {
    selectedListState.splice(indx, 1);
    setSelectedListState([...selectedListState]);
  };

  const getTick = () => {
    return (
      <div id="tick-container">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 19 9l-1.4-1.4L9 16.2z"
            fill="#28a745"
          ></path>
        </svg>
      </div>
    );
  };

  const getCross = () => {
    return (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="13"
          viewBox="0 0 12 13"
          fill="none"
        >
          <path
            d="M9 3.5L3 9.5M3 3.5L9 9.5"
            stroke="#101828"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <div>
      <div
        ref={dropDownRef}
        style={{
          position: "relative",
          border: "1px solid grey",
          borderRadius: "8px",
        }}
      >
        <div
          style={{ display: "flex", flexWrap: "wrap", padding: "2px" }}
          onClick={() => inputRef.current?.focus()}
        >
          {selectedListState.map((opt, indx) => {
            return (
              <span
                key={`selected-${opt.id}`}
                style={{
                  display: "inline-flex",
                  padding: "4px 8px",
                  margin: "0 5px 5px 0",
                  borderRadius: "10px",
                  background: "#EDEDED",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                {opt.label}
                <div onClick={() => onRemove(indx)}>{getCross()}</div>
              </span>
            );
          })}

          <input
            style={{ border: "none", outline: "none" }}
            placeholder="Select"
            autoComplete="off"
            ref={inputRef}
            onKeyDown={(e) => onBackSpace(e)}
            onChange={(ev) => debounceSearch(ev?.target.value)}
          />
        </div>
        <div
          style={{
            position: "absolute",
            zIndex: "2",
            border: "1px solid grey",
            width: "100%",
            display: showOptionState ? "block" : "none",
            background: "#EDEDED",
          }}
        >
          <ul>{getOptions()}</ul>
        </div>
      </div>
    </div>
  );
};

export default CustomDropDown;
