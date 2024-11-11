"use client";

import { useState } from "react";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import {
  downloadPdfFile2,
  generateSasUrl,
  getIP,
} from "../component/blobServer";
import { PDFDocument } from "pdf-lib";

const DownloadPageUsingFileName: React.FC = () => {
  const [objUrl, setObjUrl] = useState<string | undefined>();

  const AZURE_STORAGE_CONNECTION_STRING =
    "BlobEndpoint=https://lnhpocstorageaccount.blob.core.windows.net/;QueueEndpoint=https://lnhpocstorageaccount.queue.core.windows.net/;FileEndpoint=https://lnhpocstorageaccount.file.core.windows.net/;TableEndpoint=https://lnhpocstorageaccount.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-10-11T15:21:41Z&st=2024-10-11T07:21:41Z&spr=https,http&sig=fhhyEf6pXgydpSnghPNXyaCFRH4b6PUGveEvISoqlko%3D";
  const CONTAINER_NAME = "pad-input2";

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerClient: ContainerClient =
    blobServiceClient.getContainerClient(CONTAINER_NAME);

  const fetchUrl = async () => {
    try {
      const sasUrl = await downloadPdfFile2();

      await fetch(sasUrl)
        .then((response) => response.blob())
        .then((blob) => {
          console.log("image blob", blob);
          const url = URL.createObjectURL(blob);
          console.log(" blob url", url);
        });
    } catch (error) {
      console.log("error from front", error);
    }
  };

  const splitPDFFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // const filePath = "file:///D:/Project/demo%20blob/echap13.pdf";
    // const outputFilePath = console.log(`Starting pdf split`);
    if (!event?.target?.files) {
      return;
    }
    const file = event?.target?.files[0];
    try {
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          // const base64String = e?.target?.result?.split(',')[1];
          const pdfDoc = await PDFDocument.load(e.target?.result);
          const numPages = pdfDoc.getPageCount();
          console.log(`Number of pages in the PDF file: ${numPages}`);
          const middleIndex = Math.ceil(numPages / 2);

          // Create new PDF documents for the first and second halves
          const pdfDoc1 = await PDFDocument.create();
          const pdfDoc2 = await PDFDocument.create();

          // Copy pages to the new documents
          for (let i = 0; i < numPages; i++) {
            // const page = pdfDoc.getPage(i);
            // const [pageToBeCopied] = await pdfDoc1.copyPages(pdfDoc, [i]);
            if (i < middleIndex) {
              const [pageToBeCopied] = await pdfDoc1.copyPages(pdfDoc, [i]);
              pdfDoc1.addPage(pageToBeCopied);
              // await pdfDoc1.copyPages(pdfDoc, [i]);
            } else {
              const [pageToBeCopied] = await pdfDoc2.copyPages(pdfDoc, [i]);
              pdfDoc2.addPage(pageToBeCopied);
              // await pdfDoc2.copyPages(pdfDoc, [i]);
            }
          }

          // Save the new PDF documents
          const doc1 = new Blob([await pdfDoc1.save()], {
            type: "application/pdf",
          });
          const doc2 = new Blob([await pdfDoc2.save()], {
            type: "application/pdf",
          });

          const url1 = URL.createObjectURL(doc1);
          console.log(" blob url", url1);

          const url2 = URL.createObjectURL(doc2);
          console.log(" blob url", url2);

          console.log("PDF files split successfully.");
        }
      };

      reader.onerror = function () {
        console.log("An error occurred while reading the file.");
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center text-white flex-col space-y-2"
      style={{ alignItems: "center" }}
    >
      <button
        className="bg-[#007bff] w-[10rem] rounded-[8px] "
        style={{ padding: "10px 20px" }}
        onClick={() => fetchUrl()}
      >
        Download
      </button>

      <button
        className="bg-[#007bff] w-[12rem] rounded-[8px] "
        style={{ padding: "10px 20px" }}
        onClick={async () =>
          await downloadPdfFile2("echap13.pdf").then((val) => {
            const myDiv = document.getElementById("anchorDiv");
            const aTag = document.createElement("a");
            aTag.setAttribute("href", val);
            aTag.setAttribute("download", "random-l");
            aTag.innerText = "link text";
            if (myDiv) myDiv.appendChild(aTag);
          })
        }
      >
        Generate SAS Url
      </button>

      {objUrl && (
        <div className="ml-[50%]">
          <a target="_blank" href={objUrl}>
            url...
          </a>
        </div>
      )}

      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button
          className="bg-[#007bff] w-[10rem] rounded-[8px] "
          style={{ padding: "10px 20px" }}
          onClick={() => console.log("my ip--", generateSasUrl())}
        >
          Get IP
        </button>

        <div>
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
            Choose File to Split
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept=".pdf"
            onChange={splitPDFFile}
          />
        </div>
        <div id="anchorDiv"></div>
      </div>
    </div>
  );
};
export default DownloadPageUsingFileName;
