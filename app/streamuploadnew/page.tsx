"use client";
import { useState } from "react";

const Streamuploadnew: React.FC = () => {
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
    const chunkSize = 50 * 1024 * 1024; // 2 MB

    const uploadUrl =
      "https://lifenetapi-cqe4hmesbxbrhtet.canadaeast-01.azurewebsites.net/FileUpload/StageChunkStream";
    console.log("perform start", performance.measure("mem-meas"));
    while (selectedFiles.length > 0) {
      const tempFile = selectedFiles.pop();
      if (tempFile) {
        try {
          await uploadFileInChunks(
            tempFile,
            chunkSize,
            uploadUrl,
            (progress) => {
              console.log(`Progress: ${progress.percentage}%`);
            }
          );
          await fetch(
            `https://lifenetapi-cqe4hmesbxbrhtet.canadaeast-01.azurewebsites.net/FileUpload/CommitChunkStream/${tempFile.name}`,
            {
              method: "POST",
            }
          ).then(() => console.log("commit completed"));
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
    }
    console.log("perform start", performance.measure("mem-meas"));
  };

  async function uploadFileInChunks(
    file: File,
    chunkSize: number,
    uploadUrl: string,
    onProgress: (progress: UploadProgress) => void
  ): Promise<void> {
    const totalSize = file.size;
    let totalUploaded = 0;
    const promiseArr = [];

    // Function to create a chunk from the file
    const createChunk = (start: number, end: number): Blob => {
      return file.slice(start, end); // Slicing the file into a blob
    };

    // Function to upload a single chunk
    const uploadChunk = async (
      chunk: Blob,
      chunkIndex: number,
      totalChunk: number,
      startIndx: number,
      endIndx: number
    ): Promise<unknown> => {
      const formData = new FormData();

      formData.append("chunk", chunk);

      // Uploading the chunk using fetch API
      return fetch(`${uploadUrl}/${file.name}/${chunkIndex}`, {
        method: "POST",
        body: chunk,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Range": `bytes ${startIndx}-${endIndx - 1}/${file.size}`,
        },
      })
        .then(() => {
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
        })
        .catch((err) => {
          throw new Error(`Chunk upload failed: ${err?.statusText}`);
        });
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
      promiseArr.push(
        uploadChunk(chunk, chunkIndex, numberOfChunks, start, end)
      );
    }

    (await Promise.allSettled(promiseArr)).map((obj) => {
      console.log("result-", obj.status);
      if (obj.status === "fulfilled") {
        console.log("result-", obj.status);
      } else if (obj.status === "rejected") {
        console.log(`Failed: ${obj.reason}`);
      }
    });

    console.log("File upload completed!");
  }

  const onDownload = async (
    fileName: string = "Mock 650mb 204 pages 600dpi-2.pdf"
  ) => {
    console.log("started download");
    const apiUrl = `https://lifenet-e2awfdhdczfcaubg.southindia-01.azurewebsites.net/FileUpload/Download/${fileName}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const childTag = document.createElement("a");
      childTag.style.display = "none";
      childTag.href = url;
      childTag.download = fileName;
      childTag.target = "_blank";
      document.body.appendChild(childTag);
      childTag.click();
      document.body.removeChild(childTag);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
    console.log("completed download");
  };

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

      <div style={{ margin: "1rem" }}>
        <button
          className="bg-[#007bff] w-[10rem] rounded-[8px] "
          style={{ padding: "10px 20px" }}
          onClick={() => onDownload()}
        >
          download
        </button>
      </div>
      {/* <a
        href={`https://lifenetapi-cqe4hmesbxbrhtet.canadaeast-01.azurewebsites.net/FileUpload/Download/echap13.pdf`}
        download={"Mock 650mb 204 pages 600dpi-2.pdf"}
      >
        temp download
      </a> */}
    </div>
  );
};

export default Streamuploadnew;
