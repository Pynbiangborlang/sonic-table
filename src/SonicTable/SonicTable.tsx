import React, { useState, FC } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import DebouncedInput from "./DebouncedInput";
import PaginateComponent from "./PaginateComponent";
import "./SonicTable.css";

interface PaginaTionStateProps {
  rowsPerPage?: number;
  totalRows: number;
  selectRowsPerPageOptions?: number[];
}

interface columnsProps {
  id: string;
  accessorKey?: string;
  cell?: Function;
}

interface SonicTableProps {
  data?: Array<Object>;
  columns?: ColumnDef<Object, any>[];
  className?: string;
  isDebounce?: boolean;
  isPaginate?: boolean;
  paginationState?: PaginaTionStateProps;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaginate?: ({ page, size }: { page: number; size: number }) => void;
}

const SonicTable: FC<SonicTableProps> = ({
  data = [],
  columns = [],
  className = "",
  isDebounce = true,
  isPaginate = true,
  paginationState = {
    rowsPerPage: 10,
    totalRows: 0,
  },
  onPaginate = () => {},
  onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
  },
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  console.log("options", paginationState);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="sonic-table-container">
      {isDebounce && (
        <DebouncedInput
          className="sonic-table-input"
          placeholder="Search"
          value=""
          onChange={onSearch}
        />
      )}
      <table className={`sonic-table border-none ${className}`}>
        <thead>
          <tr>
            {table.getHeaderGroups()[0].headers.map((header) => (
              <th key={header.id}>{header.id}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {isPaginate && (
        <PaginateComponent
          initialSize={paginationState?.rowsPerPage || 10}
          totalRows={paginationState?.totalRows}
          paginateCallback={onPaginate}
          options={paginationState?.selectRowsPerPageOptions}
        />
      )}
    </div>
  );
};

export { SonicTable };
