"use client";
import { useState } from "react";

const StreamUploadPage: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  interface UploadProgress {
    totalUploaded: number;
    totalSize: number;
    percentage: number;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      setSelectedFiles([...selectedFiles, event?.target?.files[0]]);
      console.log("enter file", event?.target?.files[0]);
      event.target.files = null;
    }
  };

  const onUpload = async () => {
    const promiseArr = [];
    const chunkSize = 2 * 1024 * 1024; // 2 MB
    const uploadUrl = "https://your-server.com/upload";
    console.log("perform start", performance.measure("mem-meas"));
    while (selectedFiles.length > 0) {
      const tempFile = selectedFiles.pop();
      if (tempFile)
        promiseArr.push(
          uploadFileInChunks(tempFile, chunkSize, uploadUrl, (progress) => {
            console.log(`Progress: ${progress.percentage}%`);
          })
        );
    }
    console.log("perform start", performance.measure("mem-meas"));
    try {
      (await Promise.allSettled(promiseArr)).map((obj) => {
        console.log("result-", obj.status);
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  async function uploadFileInChunks(
    file: File,
    chunkSize: number,
    uploadUrl: string,
    onProgress: (progress: UploadProgress) => void
  ): Promise<void> {
    const totalSize = file.size;
    let totalUploaded = 0;

    // Function to create a chunk from the file
    const createChunk = (start: number, end: number): Blob => {
      return file.slice(start, end); // Slicing the file into a blob
    };

    // Function to upload a single chunk
    const uploadChunk = async (
      chunk: Blob,
      chunkIndex: number
    ): Promise<void> => {
      const formData = new FormData();
      formData.append("chunk", chunk, `${file.name}.part.${chunkIndex}`);
      formData.append("fileName", file.name);
      formData.append("chunkIndex", chunkIndex.toString());

      // Uploading the chunk using fetch API
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Chunk upload failed: ${response.statusText}`);
      }
    };

    const numberOfChunks = Math.ceil(totalSize / chunkSize);
    // console.log("numberOfChunks", numberOfChunks);
    console.log("totalSize", totalSize, file.size, chunkSize);

    // Loop through and upload each chunk sequentially
    for (let chunkIndex = 0; chunkIndex < numberOfChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, totalSize);

      const chunk = createChunk(start, end);
      console.log("chunk", chunk);

      // Upload the current chunk
      await uploadChunk(chunk, chunkIndex);

      // Update the total uploaded size
      totalUploaded += chunk.size;

      // Calculate the progress
      const percentage = Math.floor((totalUploaded / totalSize) * 100);

      // Notify progress
      onProgress({
        totalUploaded,
        totalSize,
        percentage,
      });
    }

    console.log("File upload completed!");
  }

  return (
    <div>
      <h1>Upload File as stream </h1>

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
    </div>
  );
};

export default StreamUploadPage;
