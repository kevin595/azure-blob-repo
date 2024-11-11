"use client";
import FileSelect from "@/app/component/fileSelect";
import NestedTable from "@/app/component/nestedTable";
import { FC } from "react";

const UploadPage: FC = () => {
  return (
    <div>
      <div
        style={{
          margin: "1rem 0 0 1rem",
          height: "100%",
          boxShadow: "0px 4px 8px -2px #0000001A",
          border: "1px solid #D3D3D3",
          borderRadius: "7px",
          padding: "22px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "20px", fontWeight: 700 }}>
            Upload Files
          </span>
          <span style={{ fontSize: "14px", fontWeight: 400 }}>
            Enter the Donor ID to upload documents
          </span>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="donorId">Donor ID</label>
            <input
              id={"donorId"}
              style={{
                width: "10rem",
                border: "1px solid #D0D5DD",
                borderRadius: "8px",
                fontSize: "14px",
                height: "33px",
                paddingLeft: "10px",
              }}
              placeholder="Enter donor id"
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.5rem",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 700 }}>Files</span>
          <div style={{ marginTop: "10px" }}>
            <div style={{ marginBottom: "1rem" }}>
              <NestedTable />
            </div>
            <div style={{ height: "126px", width: "670px" }}>
              <FileSelect onFileChange={(fileArr) => console.log(fileArr)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
