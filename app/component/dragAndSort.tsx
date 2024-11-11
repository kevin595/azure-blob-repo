import { FC, useRef } from "react";
import "./newdnd2.css";

export interface IFileData {
  id: string | number;
  label: string;
}

export interface ISortableListProps {
  fileDataList: IFileData[];
  onPosChange: (updatedArray: IFileData[]) => void;
}

// const demoOptionList: IFileData[] = [
//   {
//     id: 1,
//     label: "option-1",
//   },
//   {
//     id: 2,
//     label: "option-2",
//   },
//   {
//     id: 3,
//     label: "option-3",
//   },
//   {
//     id: 4,
//     label: "option-4",
//   },
// ];

const SortableList: FC<ISortableListProps> = ({
  fileDataList,
  onPosChange,
}) => {
  //save reference for dragItem and dragOverItem
  const dragItem = useRef<number>(-1);
  const dragOverItem = useRef<number>(-1);

  //const handle drag sorting
  const handleSort = () => {
    if (dragItem.current >= 0 && dragOverItem.current >= 0) {
      //duplicate items
      const _fileDataList = [...fileDataList];

      console.log("dragItem", dragItem.current);
      console.log("dragOverItem", dragOverItem.current);
      //remove and save the dragged item content
      const draggedItemContent = _fileDataList.splice(dragItem.current, 1)[0];

      console.log(_fileDataList);

      //switch the position
      _fileDataList.splice(dragOverItem.current, 0, draggedItemContent);

      console.log(_fileDataList);

      //reset the position ref
      dragItem.current = -1;
      dragOverItem.current = -1;

      //update the actual array
      // setFruitItems(_fruitItems);
      onPosChange(_fileDataList);
    }
  };

  return (
    <div>
      <div className="list-sort">
        {fileDataList.map((item, index) => (
          <div
            key={item.label}
            className="list-item"
            draggable
            onDragStart={() => (dragItem.current = index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
          >
            <i className="fa-solid fa-bars"></i>
            <h3>{item.label}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortableList;
