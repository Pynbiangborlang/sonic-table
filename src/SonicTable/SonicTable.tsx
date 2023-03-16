import React, { useState, FC, useEffect } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
  getExpandedRowModel,
} from "@tanstack/react-table";
import DebouncedInput from "./DebouncedInput";
import PaginateComponent from "./PaginateComponent";
import SonicTableProvider, { useSonicTable } from "../Hooks/useSonicTable.jsx";
import "./SonicTable.css";
import useRowDnDHelper from "./useRowDnDHelper";

interface PaginaTionStateProps {
  rowsPerPage?: number;
  totalRows: number;
  selectRowsPerPageOptions?: number[];
}

interface SonicTableProps {
  isDragable: boolean;
  data?: Array<Object>;
  columns: ColumnDef<Object, any>[];
  className?: string;
  isDebounce?: boolean;
  isPaginate?: boolean;
  isSelectable?: boolean;
  paginationState?: PaginaTionStateProps;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (row: Object) => void;
  onPaginate?: ({ page, size }: { page: number; size: number }) => void;
  onRowDrop: (dragItem: Object, dropOverItem: Object) => void;
  childrenKey: string;
  onRowShuffle: Function;
  setData: Function;
}

interface tableRow {
  id: string;
  original: Object;
  getCanSelect: Function;
  getVisibleCells: Function;
}
interface RowProps {
  isDragable: boolean;
  data?: Array<object>;
  row: tableRow;
  index: number;
  selectRow: Function;
  setRowSelection: Function;
  isSelectable: boolean;
  rowIndex: string;
  onRowDrop: Function;
  onRowShuffle: Function;
  dragState: { dragRow: any; hoverRow: any };
  setDragState: Function;
  setIsDragging: Function;
  isDragging: boolean;
  isDropping: boolean;
  setIsDropping: Function;
  setData: Function;
}

const Row: FC<RowProps> = ({
  isDragable,
  data,
  row,
  onRowShuffle,
  selectRow,
  setRowSelection,
  isSelectable,
  rowIndex,
  onRowDrop,
  dragState,
  setDragState,
  setIsDragging,
  isDragging,
  isDropping,
  setIsDropping,
  setData,
}) => {
  const [isRowDraggable, setIsDraggable] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const {
    disableDragging,
    enableDragAndDrop,
    disableDropping,
    enableDragging,
    handleDragLeave,
    handleDragStart,
    handleDrop,
    handleRowMove,
  } = useRowDnDHelper({
    data: data ?? [],
    dragState,
    isDragging,
    isDropping,
    onRowDrop,
    onRowShuffle,
    setData,
    setDragState,
    setIsDraggable,
    setIsDragging,
    setIsDropping,
    setIsHover,
  });

  const opacity = isDragging && dragState.dragRow?.id === row.id ? 0 : 1;
  const border =
    isDropping && isHover && dragState.dragRow?.id !== row.id
      ? "2px dashed grey"
      : "none";

  return (
    <tr
      style={{ opacity, border }}
      key={row.id}
      onClick={() => {
        if (!isSelectable) {
          return;
        }
        selectRow(row.id);
        setRowSelection(row.original);
      }}
      aria-selected={rowIndex === row.id}
      aria-describedby={isSelectable ? "selectable" : ""}
      draggable={isRowDraggable}
      onDragStart={(e) => handleDragStart(e, row)}
      onDragEnd={disableDragging}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => {
        e.preventDefault();
        if (isDropping) {
          setIsHover(true);
        }
      }}
      onDragEnter={(e) => handleRowMove(e, row)}
      onDrop={(e) => handleDrop(e, row)}
    >
      {isDragable ? (
        <td className="sb__table-drag-cell sb_dnd-cell">
          <button
            title="drag"
            type="button"
            className="sb__table-drag-cell--btn drag-only"
            onMouseOver={enableDragging}
            onMouseOut={() => setIsDraggable(false)}
            onMouseLeave={() => setIsDraggable(false)}
            onMouseUp={() => setIsDraggable(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </button>
          <button
            title="drag and drop"
            type="button"
            className="sb__table-drag-cell--btn drag-n-drop"
            onMouseOver={enableDragAndDrop}
            onMouseOut={disableDropping}
            onMouseLeave={disableDropping}
            onMouseUp={disableDropping}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </button>
        </td>
      ) : null}
      {row.getVisibleCells().map(
        (cell: {
          id: string;
          column: {
            columnDef: {
              cell:
                | string
                | number
                | boolean
                | React.ComponentType<any>
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined;
            };
          };
          getContext: () => any;
        }) => {
          return (
            <td
              aria-labelledby={
                /^(\d+_)(\s|actions)?$/i.test(cell.id) ? "controls" : ""
              }
              key={cell.id}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          );
        }
      )}
    </tr>
  );
};

const SonicTable: FC<SonicTableProps> = ({
  isDragable = false,
  data = [],
  columns = [],
  className = "",
  isDebounce = true,
  isPaginate = true,
  isSelectable = true,
  paginationState = {
    rowsPerPage: 10,
    totalRows: 0,
  },
  childrenKey = "subRows",
  onSelect = () => {},
  onPaginate = () => {},
  onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
  },
  onRowShuffle = () => {},
  onRowDrop = () => {},
  setData = () => {},
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [dragState, setDragState] = useState({
    dragRow: null,
    hoverRow: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [rowIndex, selectRow] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState({});

  const getChildren = (row: any) => row[childrenKey];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      rowSelection,
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => getChildren(row),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  useEffect(() => {
    onSelect(rowSelection);
  }, [rowSelection]);
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
      <div className="sb-sonic__table-box">
        {data ? (
          <table className={`sonic-table border-none ${className}`}>
            <thead>
              <tr>
                {isDragable ? <th className="sb_dnd-cell"></th> : null}
                {table.getHeaderGroups()[0].headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row: any, index) => (
                <Row
                  isDragable={isDragable}
                  key={row.id}
                  row={row}
                  data={data}
                  dragState={dragState}
                  index={index}
                  selectRow={selectRow}
                  setRowSelection={setRowSelection}
                  isSelectable={isSelectable}
                  rowIndex={rowIndex}
                  isDragging={isDragging}
                  isDropping={isDropping}
                  onRowDrop={onRowDrop}
                  setDragState={setDragState}
                  onRowShuffle={onRowShuffle}
                  setIsDragging={setIsDragging}
                  setIsDropping={setIsDropping}
                  setData={setData}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="sonic-table--empty">No rows to show</div>
        )}
      </div>
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

export { SonicTableProvider, SonicTable };
