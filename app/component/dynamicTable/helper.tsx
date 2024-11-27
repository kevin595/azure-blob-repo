// interface IOnselectProps {
//   val: boolean;
//   inputList: { isChecked?: boolean }[];
//   setInputList: (list: { isChecked?: boolean }[]) => void;
// }

import { ReactNode } from "react";

// const onSelectAll = (props: IOnselectProps) => {
//   props.inputList.map((obj) => (obj.isChecked = props.val));
//   props.setInputList(props.inputList);
// };

export interface ISortProp {
  sortBy: string;
  sortType: "asc" | "desc";
}

export const selectAllHeader = (
  inputList: { isChecked?: boolean }[],
  onSelectAll: (val: boolean) => void
): ReactNode => {
  return (
    <input
      type="checkbox"
      onClick={() => {
        onSelectAll(
          !inputList.every((currentValue) => {
            return !!currentValue.isChecked;
          })
        );
      }}
      checked={inputList.every((currentValue) => {
        return !!currentValue.isChecked;
      })}
      id="selectAll"
    />
  );
};

export const sortableHeader = (
  title: string,
  sortTag: string,
  activeSort: ISortProp,
  onSortClick: (newSort: ISortProp) => void
) => {
  const onSortSelect = () => {
    const tempSortObj: ISortProp = {
      sortBy: activeSort.sortBy,
      sortType: activeSort.sortType,
    };
    if (sortTag === activeSort.sortBy) {
      if (activeSort.sortType === "asc") {
        tempSortObj.sortType = "desc";
      } else {
        tempSortObj.sortType = "asc";
      }
    } else {
      tempSortObj.sortBy = sortTag;
      tempSortObj.sortType = "desc";
    }
    onSortClick(tempSortObj);
  };
  return <div onClick={onSortSelect}>{title}</div>;
};
