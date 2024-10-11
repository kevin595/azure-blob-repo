"use client";

import { useState } from "react";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

const DownloadPageUsingFileName: React.FC = () => {
  const [objUrl, setObjUrl] = useState<string | undefined>();

  const AZURE_STORAGE_CONNECTION_STRING =
    "BlobEndpoint=https://lnhpocstorageaccount.blob.core.windows.net/;QueueEndpoint=https://lnhpocstorageaccount.queue.core.windows.net/;FileEndpoint=https://lnhpocstorageaccount.file.core.windows.net/;TableEndpoint=https://lnhpocstorageaccount.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2024-10-10T17:01:12Z&st=2024-10-10T09:01:12Z&spr=https&sig=gvgJ3nq39H7sMUHkXYEkDdC3yfXGSn9JIaL6FBtmYI8%3D";
  const CONTAINER_NAME = "pad-input2";

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerClient: ContainerClient =
    blobServiceClient.getContainerClient(CONTAINER_NAME);

  // Helper function to convert a readable stream to a buffer
  //   async function streamToBuffer(
  //     readableStream: NodeJS.ReadableStream | null | undefined
  //   ): Promise<Buffer> {
  //     if (!readableStream) throw new Error("Readable stream is null.");

  //     return new Promise<Buffer>((resolve, reject) => {
  //       const chunks: Buffer[] = [];
  //       readableStream.on("data", (data: Buffer | string) => {
  //         chunks.push(data instanceof Buffer ? data : Buffer.from(data));
  //       });
  //       readableStream.on("end", () => {
  //         resolve(Buffer.concat(chunks));
  //       });
  //       readableStream.on("error", reject);
  //     });
  //   }

  async function blobToString(blob: Blob): Promise<string> {
    if (!blob) {
      throw new Error("blob no exist");
    }
    const fileReader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      fileReader.onloadend = (ev: any) => {
        resolve(ev.target!.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(blob);
    });
  }

  const downloadPdfFile = async (
    fileName: string = "pexels-asad-photo-maldives-3293148.jpg"
  ) => {
    try {
      // Get a reference to the container and the specific file (blob)
      // const containerClient = blobServiceClient.getContainerClient('your-container-name');
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      // Download the blob content as a browser stream
      const downloadBlockBlobResponse = await blockBlobClient.download();
      const blobData: Blob | undefined =
        await downloadBlockBlobResponse.blobBody;

      const downloaded = await blobToString(
        await downloadBlockBlobResponse.blobBody
      );
      console.log("Downloaded blob content", downloaded);

      //   const blobData =   downloadBlockBlobResponse.readableStreamBody?.read();
      //   const blobData = new Blob(blobDataStream)
      //   setObjUrl(blobData);

      //-------------------
      //   console.log("blobData.type", await downloadBlockBlobResponse.blobBody);
      //   console.log(
      //     "blobData.type",
      //     downloadBlockBlobResponse.readableStreamBody
      //   );
      //   const downloadedBuffer = await streamToBuffer(
      //     downloadBlockBlobResponse.readableStreamBody
      //   );

      //   // Convert the buffer to a Blob
      //   const blobData = new Blob([downloadedBuffer], { type: "image/jpeg" });

      //   // Create an object URL for the Blob
      //   const downloadUrl = URL.createObjectURL(blobData);
      //   setObjUrl(downloadUrl);

      //------------------
      console.log("blobData", blobData);

      // Create a URL for the blob content
      if (blobData) {
        if (blobData?.type === "image/jpeg") {
          console.log("blob is an image JPEG");
        }
        console.log(
          "blobData.type,data",
          downloadBlockBlobResponse.blobType,
          blobData
        );
        // console.log("image data--", await blobData);
        const blobUrl = URL.createObjectURL(blobData);

        //----
        // await fetch(
        //   "https://lnhpocstorageaccount.blob.core.windows.net/pad-input2/pexels-asad-photo-maldives-3293148.jpg?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2024-10-10T17:01:12Z&st=2024-10-10T09:01:12Z&spr=https&sig=gvgJ3nq39H7sMUHkXYEkDdC3yfXGSn9JIaL6FBtmYI8%3D&_=1728560121113"
        // )
        //   .then((response) => response.blob())
        //   .then((blob) => {
        //     console.log("image blob", blob);
        //     const url = URL.createObjectURL(blob);
        //     setObjUrl(url);
        //   });
        ///------
        console.log("blob url", blobUrl);
        setObjUrl(blobUrl);
      }

      // Create a link element, set the download attribute and trigger the download
      // const link = document.createElement('a');
      // link.href = blobUrl;
      // link.download = fileName;
      // document.body.appendChild(link);
      // link.click();

      // Clean up by removing the link element and revoking the blob URL
      // document.body.removeChild(link);
      // window.URL.revokeObjectURL(blobUrl);

      console.log(`${fileName} downloaded successfully`);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center align-middle text-white flex-col">
      <button onClick={() => downloadPdfFile()}>Download</button>
      {objUrl && (
        <a target="_blank" href={objUrl}>
          url...
        </a>
      )}
    </div>
  );
};
export default DownloadPageUsingFileName;
