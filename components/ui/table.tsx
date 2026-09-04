"use client";

import { forwardRef, HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "striped" | "compact" | "minimal";
}

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
  className?: string;
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
  className?: string;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  hoverable?: boolean;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  width?: string | number;
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  width?: string | number;
  sortable?: boolean;
  sorted?: "asc" | "desc" | false;
}

const variantClasses = {
  default: "border-collapse",
  bordered: "border-collapse border border-white/5",
  striped: "border-collapse",
  compact: "border-collapse text-sm",
  minimal: "border-collapse",
};

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className = "", variant = "default", ...props }, ref) => {
    return (
      <div className={`table-wrapper ${variant === "minimal" ? "minimal" : ""}`}>
        <table
          ref={ref}
          className={`table ${variantClasses[variant]} ${className}`}
          {...props}
        >
          {children}
        </table>

        <style jsx>{`
          .table-wrapper {
            width: 100%;
            overflow-x: auto;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.04);
          }

          .table-wrapper.minimal {
            background: transparent;
            border: none;
            border-radius: 0;
          }

          .table {
            width: 100%;
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.6);
          }

          .table :global(.table-header) {
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          }

          .table :global(.table-header th) {
            padding: 0.6rem 1rem;
            text-align: left;
            font-weight: 500;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            color: rgba(255, 255, 255, 0.2);
            white-space: nowrap;
          }

          .table :global(.table-body tr) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.02);
            transition: background 0.2s;
          }

          .table :global(.table-body tr:last-child) {
            border-bottom: none;
          }

          .table :global(.table-body td) {
            padding: 0.5rem 1rem;
            vertical-align: middle;
          }

          .table.bordered :global(.table-body tr) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          }

          .table.striped :global(.table-body tr:nth-child(even)) {
            background: rgba(255, 255, 255, 0.02);
          }

          .table.compact :global(.table-header th) {
            padding: 0.3rem 0.6rem;
            font-size: 0.6rem;
          }

          .table.compact :global(.table-body td) {
            padding: 0.3rem 0.6rem;
            font-size: 0.75rem;
          }

          .table-wrapper::-webkit-scrollbar {
            height: 4px;
          }

          .table-wrapper::-webkit-scrollbar-track {
            background: transparent;
          }

          .table-wrapper::-webkit-scrollbar-thumb {
            background: rgba(244, 197, 66, 0.1);
            border-radius: 2px;
          }

          @media (max-width: 480px) {
            .table :global(.table-header th) {
              padding: 0.3rem 0.5rem;
              font-size: 0.55rem;
            }
            .table :global(.table-body td) {
              padding: 0.3rem 0.5rem;
              font-size: 0.7rem;
            }
          }
        `}</style>
      </div>
    );
  }
);

Table.displayName = "Table";

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <thead ref={ref} className={`table-header ${className}`} {...props}>
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <tbody ref={ref} className={`table-body ${className}`} {...props}>
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className = "", selected = false, hoverable = true, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={`table-row ${selected ? "selected" : ""} ${hoverable ? "hoverable" : ""} ${className}`}
        {...props}
      >
        {children}

        <style jsx>{`
          .table-row.hoverable:hover {
            background: rgba(255, 255, 255, 0.03);
          }

          .table-row.selected {
            background: rgba(244, 197, 66, 0.04);
          }
        `}</style>
      </tr>
    );
  }
);

TableRow.displayName = "TableRow";

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className = "", align = "left", width, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={`table-cell ${className}`}
        style={{
          textAlign: align,
          width: width,
          minWidth: typeof width === "number" ? `${width}px` : width,
        }}
        {...props}
      >
        {children}

        <style jsx>{`
          .table-cell {
            color: rgba(255, 255, 255, 0.5);
          }
        `}</style>
      </td>
    );
  }
);

TableCell.displayName = "TableCell";

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ children, className = "", align = "left", width, sortable = false, sorted = false, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={`table-header-cell ${sortable ? "sortable" : ""} ${sorted ? `sorted-${sorted}` : ""} ${className}`}
        style={{
          textAlign: align,
          width: width,
          minWidth: typeof width === "number" ? `${width}px` : width,
        }}
        {...props}
      >
        {children}
        {sortable && (
          <span className="sort-indicator">
            {sorted === "asc" && "↑"}
            {sorted === "desc" && "↓"}
            {!sorted && "↕"}
          </span>
        )}

        <style jsx>{`
          .table-header-cell {
            font-weight: 500;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            color: rgba(255, 255, 255, 0.2);
            white-space: nowrap;
            padding: 0.6rem 1rem;
          }

          .table-header-cell.sortable {
            cursor: pointer;
            user-select: none;
            transition: color 0.3s;
          }

          .table-header-cell.sortable:hover {
            color: rgba(255, 255, 255, 0.5);
          }

          .table-header-cell.sorted-asc,
          .table-header-cell.sorted-desc {
            color: #f4c542;
          }

          .sort-indicator {
            display: inline-block;
            margin-left: 0.3rem;
            font-size: 0.6rem;
            opacity: 0.3;
          }

          .table-header-cell.sorted-asc .sort-indicator,
          .table-header-cell.sorted-desc .sort-indicator {
            opacity: 1;
          }
        `}</style>
      </th>
    );
  }
);

TableHeaderCell.displayName = "TableHeaderCell";

export default Table;