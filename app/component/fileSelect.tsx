import React from "react";

interface FileSelectProps {
  // Optional props for customization
  accept?: string;
  multiple?: boolean;
  onFileChange?: (files: File[]) => void;
}

const FileSelect: React.FC<FileSelectProps> = ({ onFileChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onFileChange && event.target.files) {
      const tempArr = Array.from(event.target.files);
      onFileChange(tempArr);
    }
    event.target.files = null;
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (onFileChange && event.dataTransfer.files) {
      const tempArr = Array.from(event.dataTransfer.files);
      onFileChange(tempArr);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      style={{
        height: "100%",
        border: "1px solid #E4E7EC",
        borderRadius: "8px",
      }}
    >
      <div
        className="drag-drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <label
          htmlFor="fileInput"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            borderRadius: "8px",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            >
              <g clip-path="url(#clip0_1262_196)">
                <path
                  d="M13.8333 13.3334L10.5 10M10.5 10L7.16663 13.3334M10.5 10V17.5M17.4916 15.325C18.3044 14.8819 18.9465 14.1808 19.3165 13.3322C19.6866 12.4837 19.7635 11.5361 19.5351 10.6389C19.3068 9.74182 18.7862 8.94629 18.0555 8.3779C17.3248 7.80951 16.4257 7.50064 15.5 7.50003H14.45C14.1977 6.5244 13.7276 5.61864 13.0749 4.85085C12.4222 4.08307 11.604 3.47324 10.6817 3.0672C9.75943 2.66116 8.75709 2.46949 7.75006 2.5066C6.74304 2.5437 5.75752 2.80861 4.86761 3.28142C3.97771 3.75422 3.20656 4.42261 2.61215 5.23635C2.01774 6.05008 1.61554 6.98797 1.43578 7.97952C1.25602 8.97107 1.30339 9.99047 1.57431 10.9611C1.84523 11.9317 2.33267 12.8282 2.99997 13.5834"
                  stroke="#475467"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              {/* <defs>
                <clipPath id="clip0_1262_196">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs> */}
            </svg>
          </div>
          <p>
            <span style={{ fontWeight: "500" }}>Click to upload </span>or drag &
            drop PDF documents
          </p>
        </label>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          accept="application/pdf"
          onChange={handleFileChange}
          multiple
        />
      </div>
    </div>
  );
};

export default FileSelect;
