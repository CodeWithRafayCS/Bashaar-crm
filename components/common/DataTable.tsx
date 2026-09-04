"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  pageSize?: number;
  showPagination?: boolean;
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectRow?: (id: string) => void;
  onSelectAll?: (selected: boolean) => void;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  onSort,
  pageSize = 10,
  showPagination = true,
  selectable = false,
  selectedRows = new Set(),
  onSelectRow,
  onSelectAll,
  actions,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentData = showPagination ? data.slice(startIndex, endIndex) : data;

  const handleSort = (key: string) => {
    if (!onSort) {
      // Local sorting
      if (sortKey === key) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }
    } else {
      onSort(key, sortKey === key && sortDirection === "asc" ? "desc" : "asc");
      if (sortKey === key) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey || onSort) return currentData;

    return [...currentData].sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" 
        ? (aVal > bVal ? 1 : -1)
        : (bVal > aVal ? 1 : -1);
    });
  }, [currentData, sortKey, sortDirection, onSort]);

  const allSelected = data.length > 0 && data.every((row) => selectedRows.has(keyExtractor(row)));

  return (
    <div className="data-table-wrapper">
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              {selectable && (
                <th className="table-cell-select">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="select-checkbox"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    textAlign: col.align || "left",
                  }}
                  className={`table-header ${col.sortable ? "sortable" : ""} ${col.className || ""}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="header-content">
                    {col.header}
                    {col.sortable && (
                      <span className="sort-icon">
                        {sortKey === col.key ? (
                          sortDirection === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <ChevronsUpDown size={14} />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {actions && (
                <th className="table-header-actions">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                  <div className="loading-state">
                    <div className="spinner" />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                  <div className="empty-state">
                    <span className="empty-icon">📋</span>
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row) => {
                const rowId = keyExtractor(row);
                const isSelected = selectedRows.has(rowId);
                return (
                  <tr
                    key={rowId}
                    className={`table-row ${onRowClick ? "clickable" : ""} ${isSelected ? "selected" : ""}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="table-cell-select" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow?.(rowId)}
                          className="select-checkbox"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{ textAlign: col.align || "left" }}
                        className={`table-cell ${col.className || ""}`}
                      >
                        {col.accessor ? col.accessor(row) : (row as any)[col.key]}
                      </td>
                    ))}
                    {actions && (
                      <td className="table-cell-actions" onClick={(e) => e.stopPropagation()}>
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} - {endIndex} of {data.length}
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronDown size={16} style={{ transform: "rotate(90deg)" }} />
            </button>
            <span className="pagination-current">
              {currentPage} / {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronDown size={16} style={{ transform: "rotate(-90deg)" }} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .data-table-wrapper {
          width: 100%;
          overflow: hidden;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .data-table-container {
          overflow-x: auto;
          padding: 0.25rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        /* Header */
        .table-header {
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          cursor: default;
          user-select: none;
          white-space: nowrap;
        }

        .table-header.sortable {
          cursor: pointer;
          transition: color 0.3s;
        }

        .table-header.sortable:hover {
          color: rgba(255, 255, 255, 0.6);
        }

        .header-content {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .sort-icon {
          display: inline-flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.1);
        }

        .table-header.sortable:hover .sort-icon {
          color: rgba(255, 255, 255, 0.3);
        }

        .table-header-actions {
          padding: 0.75rem 1rem;
          text-align: right;
          font-weight: 500;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          white-space: nowrap;
        }

        .table-cell-select {
          padding: 0.5rem 0.5rem 0.5rem 0.5rem;
          text-align: center;
          width: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .select-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #f4c542;
          cursor: pointer;
        }

        /* Body */
        .table-row {
          transition: background 0.2s;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .table-row.clickable {
          cursor: pointer;
        }

        .table-row.selected {
          background: rgba(244, 197, 66, 0.04);
        }

        .table-cell {
          padding: 0.6rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.6);
          vertical-align: middle;
        }

        .table-cell-actions {
          padding: 0.6rem 1rem;
          text-align: right;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          vertical-align: middle;
        }

        /* Loading / Empty */
        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 2.5rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 2.5rem;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.9rem;
        }

        .empty-icon {
          font-size: 2rem;
          opacity: 0.3;
        }

        /* Pagination */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .pagination-info {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .pagination-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
        }

        .pagination-btn:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        .pagination-current {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
          min-width: 50px;
          text-align: center;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .data-table {
            font-size: 0.75rem;
          }

          .table-header {
            padding: 0.4rem 0.6rem;
            font-size: 0.6rem;
          }

          .table-cell {
            padding: 0.4rem 0.6rem;
          }

          .table-cell-actions {
            padding: 0.4rem 0.6rem;
          }

          .pagination {
            flex-direction: column;
            align-items: center;
            gap: 0.3rem;
          }
        }

        @media (max-width: 480px) {
          .data-table {
            font-size: 0.7rem;
          }

          .table-header {
            padding: 0.3rem 0.4rem;
          }

          .table-cell {
            padding: 0.3rem 0.4rem;
          }

          .table-cell-actions {
            padding: 0.3rem 0.4rem;
          }

          .pagination-btn {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
}