"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

interface ControlledPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function ControlledPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  siblingCount = 1,
}: ControlledPaginationProps) {
  const { pages, hasPrev, hasNext } = usePagination({
    page,
    pageSize,
    totalItems,
    siblingCount,
  });

  if (totalItems === 0) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={!hasPrev}
            onClick={() => hasPrev && onPageChange(page - 1)}
          />
        </PaginationItem>

        {pages.map((p, idx) => (
          <PaginationItem key={idx}>
            {p === "..." ? (
              <span className="px-3 text-muted-foreground">…</span>
            ) : (
              <PaginationLink
                isActive={p === page}
                onClick={() => onPageChange(p)}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            aria-disabled={!hasNext}
            onClick={() => hasNext && onPageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
