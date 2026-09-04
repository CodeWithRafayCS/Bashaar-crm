"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
  compact?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  showPageSize = false,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageSizeChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = "",
  compact = false,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || 0);

  const visiblePages = useMemo(() => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1 && !showPageSize) {
    return null;
  }

  return (
    <div className={`pagination-container ${compact ? "compact" : ""} ${className}`}>
      {/* Info */}
      {totalItems && (
        <div className="pagination-info">
          {totalItems > 0 ? (
            <span>
              Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of{" "}
              <strong>{totalItems}</strong>
            </span>
          ) : (
            <span>No items</span>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="pagination-controls">
        {/* Page Size */}
        {showPageSize && onPageSizeChange && (
          <div className="page-size-wrapper">
            <label className="page-size-label">Show</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="page-size-select"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation */}
        <div className="pagination-buttons">
          {showFirstLast && (
            <button
              type="button"
              className={`pagination-btn ${!hasPrevious ? "disabled" : ""}`}
              onClick={() => handlePageChange(1)}
              disabled={!hasPrevious}
              aria-label="First page"
            >
              <ChevronsLeft size={compact ? 14 : 16} />
            </button>
          )}

          <button
            type="button"
            className={`pagination-btn ${!hasPrevious ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevious}
            aria-label="Previous page"
          >
            <ChevronLeft size={compact ? 14 : 16} />
          </button>

          {/* Page Numbers */}
          <div className="page-numbers">
            {visiblePages[0] > 1 && (
              <>
                <button
                  type="button"
                  className="pagination-btn page-number"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
                {visiblePages[0] > 2 && (
                  <span className="page-ellipsis">…</span>
                )}
              </>
            )}

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                className={`pagination-btn page-number ${page === currentPage ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="page-ellipsis">…</span>
                )}
                <button
                  type="button"
                  className="pagination-btn page-number"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            className={`pagination-btn ${!hasNext ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNext}
            aria-label="Next page"
          >
            <ChevronRight size={compact ? 14 : 16} />
          </button>

          {showFirstLast && (
            <button
              type="button"
              className={`pagination-btn ${!hasNext ? "disabled" : ""}`}
              onClick={() => handlePageChange(totalPages)}
              disabled={!hasNext}
              aria-label="Last page"
            >
              <ChevronsRight size={compact ? 14 : 16} />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .pagination-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.5rem 0;
          flex-wrap: wrap;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .pagination-container.compact {
          padding: 0.25rem 0;
          gap: 0.5rem;
        }

        /* Info */
        .pagination-info {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.25);
        }

        .pagination-info strong {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
        }

        /* Controls */
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        /* Page Size */
        .page-size-wrapper {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .page-size-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .page-size-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.2rem 0.4rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
        }

        .page-size-select:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .page-size-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        /* Buttons */
        .pagination-buttons {
          display: flex;
          align-items: center;
          gap: 0.15rem;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .pagination-btn:hover:not(.disabled):not(.active) {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .pagination-btn.disabled {
          opacity: 0.15;
          cursor: not-allowed;
        }

        .pagination-btn.active {
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-color: #f4c542;
          color: #0a0a0a;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.15);
        }

        .pagination-btn.page-number {
          min-width: 32px;
        }

        .pagination-container.compact .pagination-btn {
          min-width: 28px;
          height: 28px;
          font-size: 0.7rem;
        }

        .page-ellipsis {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          color: rgba(255, 255, 255, 0.08);
          font-size: 0.8rem;
          user-select: none;
        }

        .pagination-container.compact .page-ellipsis {
          min-width: 28px;
          height: 28px;
          font-size: 0.7rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .pagination-container {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .pagination-controls {
            flex-wrap: wrap;
            justify-content: center;
          }

          .page-size-wrapper {
            width: 100%;
            justify-content: center;
          }

          .pagination-btn {
            min-width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }

          .pagination-btn.page-number {
            min-width: 28px;
          }

          .page-ellipsis {
            min-width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }
        }

        @media (max-width: 480px) {
          .pagination-buttons {
            gap: 0.1rem;
          }

          .pagination-btn {
            min-width: 24px;
            height: 24px;
            font-size: 0.65rem;
          }

          .pagination-btn.page-number {
            min-width: 24px;
          }

          .page-ellipsis {
            min-width: 24px;
            height: 24px;
            font-size: 0.65rem;
          }

          .pagination-info {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}