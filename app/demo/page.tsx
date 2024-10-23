"use client";
import React, { useRef, useState } from "react";
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from "@azure/storage-blob";
import { from, of } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import { downloadPdfFile2 } from "../component/blobServer";
import { PDFDocument } from "pdf-lib";

const MultipleFileUploadWithRxJS = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const ref1 = useRef();

  // Replace with your Azure Blob Storage connection string and container name
  const AZURE_STORAGE_CONNECTION_STRING =
    "BlobEndpoint=https://lnhpocstorageaccount.blob.core.windows.net/;QueueEndpoint=https://lnhpocstorageaccount.queue.core.windows.net/;FileEndpoint=https://lnhpocstorageaccount.file.core.windows.net/;TableEndpoint=https://lnhpocstorageaccount.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2024-10-14T16:18:12Z&st=2024-10-14T08:18:12Z&spr=https,http&sig=YkOTe2BCU3ouooDBodQtUw8eeJXRSGQB4AmCNqNOjBs%3D";
  const CONTAINER_NAME = "pad-input2";

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      setSelectedFiles(Array.from(event?.target?.files));
      console.log("enter file");
      event.target.files = null;
    }
    setUploadProgress({}); // Reset progress
  };

  // check if  file is encrypted
  const checkIsFileEncrypted = async (targetFile: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const isPdfDocEncrypted = (
            await PDFDocument.load(e.target?.result, { ignoreEncryption: true })
          ).isEncrypted;

          resolve(isPdfDocEncrypted);
        }
      };
      reader.onerror = (err) => {
        console.log("An error occurred while reading the file:- ", err);
        reject(err);
      };

      reader.readAsDataURL(targetFile);
    });
  };

  // Upload files using RxJS and track progress
  const uploadFiles = () => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient: ContainerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);
    console.log("enter upload ");

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
  const uploadFileWithProgress = async (
    containerClient: ContainerClient,
    file: File
  ) => {
    // const blockBlobClient = containerClient.getBlockBlobClient(file.name);
    // const isFileEncrypted = await checkIsFileEncrypted(file);
    // console.log("is file encrypted", isFileEncrypted);
    console.log("file name from upload", file.name);

    //using controlled sas permission
    const sasUrl = await downloadPdfFile2(file.name);
    const blockBlobClient = new BlockBlobClient(sasUrl);
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
      <input
        type="file"
        ref={ref1.current}
        multiple
        onChange={handleFileChange}
      />
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
