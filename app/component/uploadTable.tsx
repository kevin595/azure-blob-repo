"use client";
import { FC, useState } from "react";
import StreamUpload from "./streamUpload";
import SortContainer from "./dragAndSort/sortConatainer";
import SortableItem from "./dragAndSort/sortableItem";

export interface IFileData {
  id: number;
  name: string;
}

interface IUploadFile {
  file: File;
  progress: number;
}

export interface INestedTableProps {
  uploadingFiles: IUploadFile[];
  completedFiles: IFileData[];
  onSortEnd: (oldIndex: number, newIndex: number) => void;
}

export const tempFile: IFileData[] = [
  { id: 1, name: "temp1" },
  { id: 2, name: "temp2" },
  { id: 3, name: "temp3" },
];

const UploadTable: FC<INestedTableProps> = ({
  uploadingFiles,
  completedFiles,
  onSortEnd,
}) => {
  //   const [tableDataState, setTableDataState] = useState(data);
  const [selectAllState, setSelectAllState] = useState(false);

  return (
    <div>
      <SortContainer onSortEnd={onSortEnd}>
        <table
          style={{
            border: "1px solid #E4E7EC",
            borderRadius: "8px",
            borderCollapse: "separate",
          }}
        >
          <thead>
            <tr
              style={{
                padding: "0.2rem 0",
                background: "#F9FAFB",
              }}
            >
              <th style={{ padding: "0 1rem" }}>
                <input
                  type="checkbox"
                  // onClick={onSelectAll}
                  checked={selectAllState}
                  id="selectAll"
                />
              </th>
              <th
                style={{
                  padding: "0 1rem",
                  color: "#667085",
                  fontSize: "12px",
                }}
              >
                File Name
              </th>
              <th
                style={{
                  padding: "0 1rem",
                  color: "#667085",
                  fontSize: "12px",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "0 1rem",
                  color: "#667085",
                  fontSize: "12px",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {completedFiles.map((item) => (
              // <SortableItem key={item.name}>
              <tr
                key={item.name}
                style={{
                  padding: "0.2rem 0",
                  // borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
                }}
              >
                <td></td>
                <td>{item.name}</td>
                <td></td>
              </tr>
              // </SortableItem>
            ))}
            {uploadingFiles.map((obj) => {
              return (
                <tr
                  style={{
                    padding: "0.2rem 0",
                    // borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
                  }}
                  key={obj.file.name}
                >
                  <StreamUpload inputFile={obj.file} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </SortContainer>
    </div>
  );
};

export default UploadTable;
