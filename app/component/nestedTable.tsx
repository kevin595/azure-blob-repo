import { FC, useState } from "react";

export interface IReportData {
  name: string;
  id: string;
  type: string;
  status: "success" | "error";
  isSelected?: boolean;
}

export interface IVersionReportData {
  name: string;
  versions: IReportData[];
  isSelected?: boolean;
  isOpen?: boolean;
}

export interface INestedTableProps {
  data?: IVersionReportData[];
}

const defaultData: IVersionReportData[] = [
  {
    name: "Medical Report",
    versions: [
      {
        id: "med-1",
        name: "med-v1",
        status: "success",
        type: "medical",
      },
      {
        id: "med-2",
        name: "med-v2",
        status: "success",
        type: "medical",
      },
    ],
  },
  {
    name: "Lab Report",
    versions: [
      {
        id: "lab-1",
        name: "lab-v1",
        status: "success",
        type: "lab",
      },
      {
        id: "lab-2",
        name: "lab-v2",
        status: "success",
        type: "lab",
      },
      {
        id: "lab-3",
        name: "lab-v3",
        status: "error",
        type: "lab",
      },
    ],
  },
];

const NestedTable: FC<INestedTableProps> = ({ data = defaultData }) => {
  const [tableDataState, setTableDataState] = useState(data);
  const [selectAllState, setSelectAllState] = useState(false);

  const onOpen = (indx: number) => {
    tableDataState[indx].isOpen = !tableDataState[indx]?.isOpen;
    setTableDataState([...tableDataState]);
  };

  const onSelectAll = () => {
    const checkBoxValue = !selectAllState;
    tableDataState.map((reportTypeObj) => {
      reportTypeObj.isSelected = checkBoxValue;
      reportTypeObj.versions.map((reportObj) => {
        reportObj.isSelected = checkBoxValue;
      });
    });
    setSelectAllState(checkBoxValue);
    setTableDataState([...tableDataState]);
  };

  const onReportTypeCheckBoxClick = (indx: number) => {
    const checkBoxValue = !tableDataState[indx].isSelected;
    let isAllChecked = true;
    tableDataState.map((reportTypeObj, curIndx) => {
      if (curIndx === indx) {
        reportTypeObj.isSelected = checkBoxValue;
        reportTypeObj.versions.map((reportObj) => {
          reportObj.isSelected = checkBoxValue;
        });
      }
      isAllChecked = isAllChecked && !!reportTypeObj?.isSelected;
    });
    setSelectAllState(isAllChecked);
    setTableDataState([...tableDataState]);
  };

  const onReportCheckBoxClick = (
    reportIndx: number,
    reportTypeIndx: number
  ) => {
    const checkBoxValue =
      !tableDataState[reportTypeIndx].versions[reportIndx].isSelected;
    let isAllChecked = true;
    let isAllReportChecked = true;
    tableDataState.map((reportTypeObj, curIndx) => {
      if (curIndx === reportTypeIndx) {
        reportTypeObj.isSelected = checkBoxValue;
        reportTypeObj.versions.map((reportObj, curReportIndx) => {
          if (reportIndx == curReportIndx) {
            reportObj.isSelected = checkBoxValue;
          }
          isAllReportChecked = isAllReportChecked && !!reportObj.isSelected;
        });
      }
      isAllChecked = isAllChecked && !!reportTypeObj?.isSelected;
    });
    tableDataState[reportTypeIndx].isSelected = isAllReportChecked;
    setSelectAllState(isAllChecked);
    setTableDataState([...tableDataState]);
  };

  return (
    <div>
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
                onClick={onSelectAll}
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
              Name
            </th>
            <th
              style={{
                padding: "0 1rem",
                color: "#667085",
                fontSize: "12px",
              }}
            >
              Version
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
          </tr>
        </thead>
        <tbody>
          {tableDataState.map((obj, indx) => {
            if (obj?.isOpen) {
              return (
                <>
                  <tr
                    style={{
                      padding: "0.2rem 0",
                      // borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
                    }}
                    key={obj.name}
                  >
                    <td style={{ padding: "0 1rem" }}>
                      <input
                        type="checkbox"
                        onClick={() => onReportTypeCheckBoxClick(indx)}
                        checked={obj.isSelected}
                      />
                    </td>
                    <td
                      onClick={() => onOpen(indx)}
                      style={{ padding: "0 1rem" }}
                    >
                      {obj.name}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  {obj.versions.map((report, reportIndx) => {
                    return (
                      <tr
                        style={{
                          padding: "0.2rem 0",
                          // borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
                        }}
                        key={report.id}
                      >
                        <td style={{ padding: "0 1rem" }}>
                          <input
                            type="checkbox"
                            onClick={() =>
                              onReportCheckBoxClick(reportIndx, indx)
                            }
                            checked={report.isSelected}
                          />
                        </td>
                        <td style={{ padding: "0 1rem" }}>{report.name}</td>
                        <td style={{ padding: "0 1rem" }}>{report.type}</td>
                        <td style={{ padding: "0 1rem" }}>{report.status}</td>
                      </tr>
                    );
                  })}
                </>
              );
            } else {
              return (
                <tr
                  style={{
                    padding: "0.2rem 0",
                    // borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
                  }}
                  key={obj.name}
                >
                  <td style={{ padding: "0 1rem" }}>
                    <input
                      type="checkbox"
                      onClick={() => onReportTypeCheckBoxClick(indx)}
                      checked={obj.isSelected}
                    />
                  </td>
                  <td
                    style={{ padding: "0 1rem" }}
                    onClick={() => onOpen(indx)}
                  >
                    {obj.name}
                  </td>
                  <td style={{ padding: "0 1rem" }}></td>
                  <td style={{ padding: "0 1rem" }}></td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NestedTable;
