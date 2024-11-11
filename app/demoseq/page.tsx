"use client";
import React, { useRef, useState } from "react";
import { BlockBlobClient } from "@azure/storage-blob";

import { downloadPdfFile2 } from "../component/blobServer";
import { AbortSignalLike } from "@azure/abort-controller";

const DemoSequentialPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  //   const [uploadProgress, setUploadProgress] = useState({});
  const abortRefArray = useRef<AbortController[]>([]);

  // Replace with your Azure Blob Storage connection string and container name
  //   const AZURE_STORAGE_CONNECTION_STRING =
  //     "BlobEndpoint=https://lnhpocstorageaccount.blob.core.windows.net/;QueueEndpoint=https://lnhpocstorageaccount.queue.core.windows.net/;FileEndpoint=https://lnhpocstorageaccount.file.core.windows.net/;TableEndpoint=https://lnhpocstorageaccount.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2024-10-14T16:18:12Z&st=2024-10-14T08:18:12Z&spr=https,http&sig=YkOTe2BCU3ouooDBodQtUw8eeJXRSGQB4AmCNqNOjBs%3D";
  //   const CONTAINER_NAME = "pad-input2";

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      setSelectedFiles([...selectedFiles, event?.target?.files[0]]);
      console.log("enter file", event?.target?.files[0]);
      event.target.files = null;
    }
    // setUploadProgress({}); // Reset progress
  };

  const onUpload = async () => {
    const promiseArr = [];
    console.log("perform start", performance.measure("mem-meas"));
    abortRefArray.current = [];
    while (selectedFiles.length > 0) {
      const tempFile = selectedFiles.pop();
      if (tempFile) {
        const abortController = new AbortController();
        abortRefArray.current.push(abortController);
        const abortSignal: AbortSignalLike = abortController.signal;
        promiseArr.push(uploadFileWithProgress(tempFile, abortSignal));
      }
    }
    console.log("perform start", performance.measure("mem-meas"));
    (await Promise.allSettled(promiseArr)).map((obj) => {
      console.log("result-", obj.status);
    });
  };

  // Function to upload a single file with progress tracking
  const uploadFileWithProgress = async (
    file: File,
    abortSignal: AbortSignalLike
  ) => {
    // const blockBlobClient = containerClient.getBlockBlobClient(file.name);

    //using controlled sas permission
    console.log("is api call????");
    const sasUrl = await downloadPdfFile2(file.name);
    const blockBlobClient = new BlockBlobClient(sasUrl);
    console.log("uploading");

    return new Promise((resolve, reject) => {
      console.log("file.type", file.type);
      blockBlobClient
        .uploadData(file, {
          blobHTTPHeaders: { blobContentType: file.type },
          //adding abort signal
          abortSignal: abortSignal,
          onProgress: (progressEvent) => {
            const percentComplete = Math.round(
              (progressEvent.loadedBytes / file.size) * 100
            );
            console.log(file.name, "-percentComplete-", percentComplete);
            // setUploadProgress((prevProgress) => ({
            //   ...prevProgress,
            //   [file.name]: percentComplete,
            // }));
          },
        })
        .then(resolve)
        .catch(reject);
    });
  };

  return (
    <div>
      <h1>Upload Multiple Files </h1>

      <div
        style={{
          padding: "1rem 2rem",
          border: "1px solid #9999c7",
          boxShadow: "0px 0px 3px 2px #9999c7",
          margin: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ width: "10rem", overflow: "hidden" }}>
            {selectedFiles[0] ? selectedFiles[0].name : "Filename.."}
          </div>
          <label
            htmlFor="fileInput"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            Choose a File
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ width: "10rem", overflow: "hidden" }}>
            {selectedFiles[1] ? selectedFiles[1].name : "Filename.."}
          </div>
          <label
            htmlFor="fileInput1"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            Choose a File
          </label>
          <input
            type="file"
            id="fileInput1"
            style={{ display: "none" }}
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ width: "10rem", overflow: "hidden" }}>
            {selectedFiles[2] ? selectedFiles[2].name : "Filename.."}
          </div>
          <label
            htmlFor="fileInput2"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            Choose a File
          </label>
          <input
            type="file"
            id="fileInput2"
            style={{ display: "none" }}
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ width: "10rem", overflow: "hidden" }}>
            {selectedFiles[3] ? selectedFiles[3].name : "Filename.."}
          </div>
          <label
            htmlFor="fileInput3"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            Choose a File
          </label>
          <input
            type="file"
            id="fileInput3"
            style={{ display: "none" }}
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div style={{ margin: "1rem" }}>
        <button
          className="bg-[#007bff] w-[10rem] rounded-[8px] "
          style={{ padding: "10px 20px" }}
          onClick={onUpload}
        >
          upload
        </button>
      </div>

      <div style={{ margin: "1rem" }}>
        <button
          className="bg-[#007bff] w-[10rem] rounded-[8px] "
          style={{ padding: "10px 20px" }}
          onClick={() => {
            abortRefArray.current[0].abort();
            abortRefArray.current[1].abort();
            console.info(`abort:-,${abortRefArray.current[0].signal.aborted}`);
          }}
        >
          abort 1
        </button>
      </div>

      <div style={{ margin: "1rem" }}>
        <button
          className="bg-[#007bff] w-[10rem] rounded-[8px] "
          style={{ padding: "10px 20px" }}
          onClick={() =>
            downloadPdfFile2().then((val) =>
              console.log("from ckick cons", val)
            )
          }
        >
          check server
        </button>
      </div>
    </div>
  );
};

export default DemoSequentialPage;
