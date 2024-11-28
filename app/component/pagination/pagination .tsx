import { FC } from "react";

export interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageClick: (val: number) => void;
}

const Pagination: FC<IPaginationProps> = ({
  totalPages,
  currentPage,
  onPageClick,
}) => {
  let isMiddle = false;
  const totalSlots = 7;
  if (
    currentPage - 3 > 1 &&
    totalPages > totalSlots &&
    currentPage + 3 < totalPages
  ) {
    isMiddle = true;
  }

  const getPages = () => {
    const tempNodes = [];
    const isLeft = currentPage <= totalPages / 2.0;
    console.log("isMiddle", isMiddle, currentPage);
    if (!isMiddle && totalPages > 2) {
      if (totalPages <= totalSlots) {
        for (let i = 2; i < totalPages; i++) {
          const pageNode = (
            <div key={`page-${i}`} onClick={() => onPageClick(i)}>
              {i}
            </div>
          );
          tempNodes.push(pageNode);
        }
      } else {
        if (isLeft) {
          for (let i = 2; i < 6; i++) {
            const pageNode = (
              <div key={`page-${i}`} onClick={() => onPageClick(i)}>
                {i}
              </div>
            );
            tempNodes.push(pageNode);
          }
        } else {
          for (let i = totalPages - 4; i < totalPages; i++) {
            const pageNode = (
              <div key={`page-${i}`} onClick={() => onPageClick(i)}>
                {i}
              </div>
            );
            tempNodes.push(pageNode);
          }
        }
      }
    }
    return tempNodes;
  };
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <div onClick={() => onPageClick(1)}>
        <span>1</span>
      </div>

      {currentPage - 3 > 1 && totalPages > totalSlots && <div>...</div>}

      {isMiddle
        ? [currentPage - 1, currentPage, currentPage + 1].map((val) => {
            return (
              <div key={`page-${val}`} onClick={() => onPageClick(val)}>
                {val}
              </div>
            );
          })
        : null}

      {getPages().map((obj) => obj)}

      {currentPage + 3 < totalPages && totalPages > totalSlots && (
        <div>...</div>
      )}

      {totalPages > 1 && (
        <div onClick={() => onPageClick(totalPages)}>
          <span>{totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
