"use client";
import { FC, useCallback, useState } from "react";
import NestedTable from "../component/nestedTable";
import CustomDropDown from "../component/dropdown";
import FileSelect from "../component/fileSelect";
// import ListSort from "../component/newdnd";
import SortableList, { IFileData } from "../component/dragAndSort";
import SortContainer from "../component/dragAndSort/sortConatainer";
import SortableItem from "../component/dragAndSort/sortableItem";
import { arrayMove } from "../component/dragAndSort/helper";
import DynamicTable, {
  IColumnType,
} from "../component/dynamicTable/dynamicTable";

export interface IDonorList {
  filename: string;
  uploadedBy: string;
  uploadedOn: string;
  status: string;
  id: number;
}

export interface ITableProps extends IDonorList {
  isChecked?: boolean;
}

const DemoCmpPage: FC = () => {
  const [fileListState, setFileListState] = useState<IFileData[]>([
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
  ]);
  const [items, setItems] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
  ]);
  const [donorListState, setDonorListState] = useState<ITableProps[]>([
    {
      id: 1,
      filename: "temp1",
      status: "inprogress",
      uploadedBy: "me",
      uploadedOn: "today",
      isChecked: false,
    },
    {
      id: 2,
      filename: "temp2",
      status: "inprogress",
      uploadedBy: "me",
      uploadedOn: "today",
      isChecked: true,
    },
    {
      id: 3,
      filename: "temp3",
      status: "inprogress",
      uploadedBy: "me",
      uploadedOn: "today",
      isChecked: true,
    },
  ]);

  const columnData = useCallback((): IColumnType<ITableProps>[] => {
    const tempColumnData: IColumnType<ITableProps>[] = [
      {
        title: "isChecked",
        dataIndex: "isChecked",
        renderHeader: () => {
          return (
            <input
              type="checkbox"
              // onClick={onSelectAll}
              checked={donorListState.every((currentValue) => {
                return !!currentValue.isChecked;
              })}
              id="selectAll"
            />
          );
        },
        render: (val, record, indx) => {
          return (
            <input
              type="checkbox"
              onClick={() => {
                donorListState[indx].isChecked = !val;
                setDonorListState([...donorListState]);
              }}
              checked={val}
              id={`${record.id}-checkBox`}
            />
          );
        },
      },
      {
        title: "FileName",
        dataIndex: "filename",
      },
      {
        title: "Uploaded by",
        dataIndex: "uploadedBy",
      },
      {
        title: "uploaded on",
        dataIndex: "uploadedOn",
      },
      {
        title: "status",
        dataIndex: "status",
      },
    ];
    return tempColumnData;
  }, [donorListState]);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setItems([...arrayMove(items, oldIndex, newIndex)]);
  };

  return (
    <div
      style={{
        background: "white",
        width: "100%",
        height: "100vh",
        minHeight: "1000px",
        color: "black",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          justifyContent: "center",
          paddingTop: "5rem",
        }}
      >
        <NestedTable />
        <div style={{ margin: "1rem" }}>
          <CustomDropDown />
        </div>
        <div style={{ margin: "1rem", height: "300px" }}>
          <FileSelect onFileChange={(fileArr) => console.log(fileArr)} />
        </div>
        <div style={{ margin: "1rem", height: "300px" }}>
          {/* <ListSort /> */}
          <SortableList
            fileDataList={fileListState}
            onPosChange={(newData) => setFileListState(newData)}
          />
        </div>
        <div style={{ margin: "1rem" }}>
          <SortContainer onSortEnd={onSortEnd}>
            {items.map((item) => (
              <SortableItem key={item}>
                <div
                  style={{
                    padding: "3rem",
                    width: "350px",
                    background: "blue",
                    margin: "1rem",
                  }}
                >
                  <button style={{ width: "2rem" }}>{item}</button>
                </div>
              </SortableItem>
            ))}
          </SortContainer>
        </div>
        <div style={{ margin: "1rem" }}>
          <DynamicTable columns={columnData()} dataSource={donorListState} />
        </div>
        <div
          style={{
            margin: "1rem",
            border: "1px solid red",
            height: "2rem",
            width: "4rem",
          }}
        >
          <div>helloooo ----</div>
          <input type="datetime-local" placeholder="enter date" />
        </div>
      </div>
    </div>
  );
};

export default DemoCmpPage;
