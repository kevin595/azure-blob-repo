"use client";
import React, { useState } from "react";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { from, of } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";

const MultipleFileUploadWithRxJS = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // Replace with your Azure Blob Storage connection string and container name
  const AZURE_STORAGE_CONNECTION_STRING =
    "BlobEndpoint=https://lnhpocstorageaccount.blob.core.windows.net/;QueueEndpoint=https://lnhpocstorageaccount.queue.core.windows.net/;FileEndpoint=https://lnhpocstorageaccount.file.core.windows.net/;TableEndpoint=https://lnhpocstorageaccount.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bf&srt=sco&sp=rwdactfx&se=2024-10-10T14:57:28Z&st=2024-10-10T06:57:28Z&spr=https,http&sig=oU70unOhHyH%2FXWYOQL1RAcBvCIZsCM%2BTdic1dU8IchM%3D";
  const CONTAINER_NAME = "pad-input2";

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      setSelectedFiles(Array.from(event?.target?.files));
      console.log("enter file");
    }
    setUploadProgress({}); // Reset progress
  };

  // Upload files using RxJS and track progress
  const uploadFiles = () => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient: ContainerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);

    from(selectedFiles)
      .pipe(
        mergeMap((file) =>
          // For each file, create an observable for upload progress
          from(uploadFileWithProgress(containerClient, file)).pipe(
            catchError((error) => {
              console.error(`Error uploading ${file.name}:`, error);
              setUploadProgress((prevProgress) => ({
                ...prevProgress,
                [file.name]: "Error",
              }));
              return of(error);
            })
          )
        )
      )
      .subscribe();
  };

  // Function to upload a single file with progress tracking
  const uploadFileWithProgress = (
    containerClient: ContainerClient,
    file: File
  ) => {
    const blockBlobClient = containerClient.getBlockBlobClient(file.name);
    console.log("uploading");

    return new Promise((resolve, reject) => {
      console.log("file.type", file.type);
      blockBlobClient
        .uploadData(file, {
          blobHTTPHeaders: { blobContentType: file.type },
          onProgress: (progressEvent) => {
            const percentComplete = Math.round(
              (progressEvent.loadedBytes / file.size) * 100
            );
            setUploadProgress((prevProgress) => ({
              ...prevProgress,
              [file.name]: percentComplete,
            }));
          },
        })
        .then(resolve)
        .catch(reject);
    });
  };

  return (
    <div>
      <h2>Upload Multiple Files with Progress (RxJS)</h2>
      <input type="file" multiple onChange={handleFileChange} />
      <button className="bg-slate-300" onClick={uploadFiles}>
        Upload
      </button>

      {selectedFiles.map((file) => (
        <div key={file.name}>
          <p>{file.name}</p>
          <div style={{ width: "100%", backgroundColor: "#e0e0e0" }}>
            <div
              style={{
                width: `${
                  uploadProgress[file.name as keyof typeof uploadProgress] || 0
                }%`,
                backgroundColor: "#76c7c0",
                textAlign: "center",
                padding: "5px 0",
                color: "white",
              }}
            >
              {uploadProgress[file.name as keyof typeof uploadProgress]
                ? `${uploadProgress[file.name as keyof typeof uploadProgress]}%`
                : "0%"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultipleFileUploadWithRxJS;
