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
