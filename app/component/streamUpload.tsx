import { FC, startTransition, useEffect, useState } from "react";

export interface IStreamUploadProps {
  inputFile: File;
}

interface UploadProgress {
  totalUploaded: number;
  totalSize: number;
  percentage: number;
}

const StreamUpload: FC<IStreamUploadProps> = ({ inputFile }) => {
  const [uploadProgressState, setUploadProgressState] = useState(0);

  useEffect(() => {
    if (inputFile) {
      onUpload(inputFile);
    }
  }, []);

  const onUpload = async (file: File) => {
    const chunkSize = 50 * 1024 * 1024; // 2 MB

    const uploadUrl =
      "https://lifenetapi-cqe4hmesbxbrhtet.canadaeast-01.azurewebsites.net/FileUpload/StageChunkStream";
    try {
      await uploadFileInChunks(file, chunkSize, uploadUrl, (progress) => {
        startTransition(() => {
          setUploadProgressState(progress.percentage);
        });
      });
      await fetch(
        `https://lifenetapi-cqe4hmesbxbrhtet.canadaeast-01.azurewebsites.net/FileUpload/CommitChunkStream/${file.name}`,
        {
          method: "POST",
        }
      ).then(() => console.log("commit completed"));
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

  return (
    <>
      <td style={{ padding: "0 1rem" }}>
        {/* <input
                      type="checkbox"
                      onClick={() => onReportTypeCheckBoxClick(indx)}
                      checked={obj.isSelected}
                    /> */}
      </td>
      <td
        // onClick={() => onOpen(indx)}
        style={{ padding: "0 1rem" }}
      >
        {inputFile.name} - {uploadProgressState}
      </td>
      <td></td>
    </>
  );
};

export default StreamUpload;
