import { useMemo } from "react";

interface UsePaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  siblingCount?: number;
}

export function usePagination({
  page,
  pageSize,
  totalItems,
  siblingCount = 1,
}: UsePaginationProps) {
  return useMemo(() => {
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalPages <= 1) {
      return {
        totalPages,
        pages: [1],
        hasPrev: false,
        hasNext: false,
      };
    }

    const startPage = Math.max(1, page - siblingCount);
    const endPage = Math.min(totalPages, page + siblingCount);

    const pages: (number | "...")[] = [];

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return {
      totalPages,
      pages,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    };
  }, [page, pageSize, totalItems, siblingCount]);
}
