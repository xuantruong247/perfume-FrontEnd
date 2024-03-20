import { useMemo } from "react";
import { generateRange } from "../utils/helpers";
import { BsThreeDots } from "react-icons/bs";

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
  const paginationArray = useMemo(() => {
    const pageSize = process.env.REACT_APP_PRODUCT_LIMIT || 12;
    const paginationCount = Math.ceil(totalProductCount / pageSize);
    const totalPaginationItem = siblingCount + 5;

    if (paginationCount <= totalPaginationItem)
      return generateRange(1, paginationCount);

    const isShowLeft = currentPage - siblingCount > 2;
    const isShowRight = currentPage + siblingCount < paginationCount - 1;

    if (isShowLeft && !isShowRight) {
      const rightStart = paginationCount - 4;
      const rightRange = generateRange(rightStart, paginationCount);
      return [1, <BsThreeDots />, ...rightRange];
    }

    if (!isShowLeft && isShowRight) {
      const leftRange = generateRange(1, 5);
      return [...leftRange, <BsThreeDots />, paginationCount];
    }

    const siblingLeft = Math.max(currentPage - siblingCount, 1);
    const siblingRight = Math.min(currentPage + siblingCount, paginationCount);

    if (isShowLeft && isShowRight) {
      const middleRange = generateRange(siblingLeft, siblingRight);
      return [
        1,
        <BsThreeDots />,
        ...middleRange,
        <BsThreeDots />,
        paginationCount,
      ];
    }
  }, [totalProductCount, currentPage, siblingCount]);
  return paginationArray;
};

export default usePagination;

// first + last + current  + sibling(những page kế bên) + 2*DOTSS
// min = 6 => sibling + 5
// totalProductCount: 58, mỗi page = 10product => 5.8 ~~ 6
// totalPaginationItem: sibbing + 5 = 6
// sibling = 1

// [1,2,3,4,5,6]
// [1,......6,7,8,9,10]
// [1,2,3,4,5, .....,10]
//[1,....5,6,7,...,10]
