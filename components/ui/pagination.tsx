"use client";

import { forwardRef, ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export interface PaginationProps {
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
  size?: "sm" | "md" | "lg";
  showTotal?: boolean;
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
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
      size = "md",
      showTotal = true,
    },
    ref
  ) => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems || 0);

    const visiblePages = [];
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    };

    const sizeClasses = {
      sm: {
        button: "h-7 w-7 text-xs",
        icon: "w-3.5 h-3.5",
        select: "text-xs h-7",
        text: "text-xs",
      },
      md: {
        button: "h-9 w-9 text-sm",
        icon: "w-4 h-4",
        select: "text-sm h-9",
        text: "text-sm",
      },
      lg: {
        button: "h-11 w-11 text-base",
        icon: "w-5 h-5",
        select: "text-base h-11",
        text: "text-base",
      },
    };

    const sizes = sizeClasses[size];

    if (totalPages <= 1 && !showPageSize) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={`pagination-wrapper ${compact ? "compact" : ""} ${className}`}
      >
        {/* Info */}
        {showTotal && totalItems && (
          <div className={`pagination-info ${sizes.text}`}>
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

        <div className="pagination-controls">
          {/* Page Size */}
          {showPageSize && onPageSizeChange && (
            <div className="page-size-wrapper">
              <label className={`page-size-label ${sizes.text}`}>Show</label>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className={`page-size-select ${sizes.select}`}
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
                className={`pagination-btn ${sizes.button} ${!hasPrevious ? "disabled" : ""}`}
                onClick={() => handlePageChange(1)}
                disabled={!hasPrevious}
                aria-label="First page"
              >
                <ChevronsLeft className={sizes.icon} />
              </button>
            )}

            <button
              type="button"
              className={`pagination-btn ${sizes.button} ${!hasPrevious ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevious}
              aria-label="Previous page"
            >
              <ChevronLeft className={sizes.icon} />
            </button>

            {/* Page Numbers */}
            <div className="page-numbers">
              {visiblePages[0] > 1 && (
                <>
                  <button
                    type="button"
                    className={`pagination-btn page-number ${sizes.button}`}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                  {visiblePages[0] > 2 && (
                    <span className={`page-ellipsis ${sizes.button}`}>…</span>
                  )}
                </>
              )}

              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`pagination-btn page-number ${sizes.button} ${page === currentPage ? "active" : ""}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <span className={`page-ellipsis ${sizes.button}`}>…</span>
                  )}
                  <button
                    type="button"
                    className={`pagination-btn page-number ${sizes.button}`}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              className={`pagination-btn ${sizes.button} ${!hasNext ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              aria-label="Next page"
            >
              <ChevronRight className={sizes.icon} />
            </button>

            {showFirstLast && (
              <button
                type="button"
                className={`pagination-btn ${sizes.button} ${!hasNext ? "disabled" : ""}`}
                onClick={() => handlePageChange(totalPages)}
                disabled={!hasNext}
                aria-label="Last page"
              >
                <ChevronsRight className={sizes.icon} />
              </button>
            )}
          </div>
        </div>

        <style jsx>{`
          .pagination-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            padding: 0.5rem 0;
            flex-wrap: wrap;
            border-top: 1px solid rgba(255, 255, 255, 0.03);
          }

          .pagination-wrapper.compact {
            padding: 0.25rem 0;
            gap: 0.5rem;
          }

          .pagination-wrapper.compact .pagination-info {
            font-size: 0.7rem;
          }

          .pagination-wrapper.compact .pagination-btn {
            min-width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }

          .pagination-wrapper.compact .page-ellipsis {
            min-width: 28px;
            height: 28px;
          }

          /* Info */
          .pagination-info {
            color: rgba(255, 255, 255, 0.2);
          }

          .pagination-info strong {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.4);
          }

          /* Controls */
          .pagination-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-wrap: wrap;
          }

          /* Page Size */
          .page-size-wrapper {
            display: flex;
            align-items: center;
            gap: 0.3rem;
          }

          .page-size-label {
            color: rgba(255, 255, 255, 0.15);
          }

          .page-size-select {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 6px;
            padding: 0.2rem 0.4rem;
            color: rgba(255, 255, 255, 0.4);
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
            gap: 0.1rem;
          }

          .pagination-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 36px;
            height: 36px;
            border: 1px solid rgba(255, 255, 255, 0.04);
            background: transparent;
            border-radius: 6px;
            color: rgba(255, 255, 255, 0.2);
            cursor: pointer;
            transition: all 0.3s;
            font-family: inherit;
            font-weight: 500;
          }

          .pagination-btn:hover:not(.disabled):not(.active) {
            background: rgba(255, 255, 255, 0.04);
            color: rgba(255, 255, 255, 0.4);
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
            min-width: 36px;
          }

          .page-ellipsis {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 36px;
            height: 36px;
            color: rgba(255, 255, 255, 0.05);
            user-select: none;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .pagination-wrapper {
              flex-direction: column;
              align-items: center;
              gap: 0.5rem;
            }

            .pagination-controls {
              justify-content: center;
            }

            .pagination-btn {
              min-width: 32px;
              height: 32px;
              font-size: 0.8rem;
            }

            .pagination-btn.page-number {
              min-width: 32px;
            }

            .page-ellipsis {
              min-width: 32px;
              height: 32px;
            }
          }

          @media (max-width: 480px) {
            .pagination-wrapper {
              padding: 0.25rem 0;
            }

            .pagination-info {
              font-size: 0.7rem;
              text-align: center;
            }

            .pagination-controls {
              flex-direction: column;
              align-items: center;
              gap: 0.3rem;
            }

            .page-size-wrapper {
              width: 100%;
              justify-content: center;
            }

            .pagination-buttons {
              gap: 0.05rem;
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
        `}</style>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;