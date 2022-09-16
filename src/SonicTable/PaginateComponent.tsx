/**
 * Pagination controller
 * it has a drop down menu for selecting number of rows to display at once
 * it has a two link to navigate between pages
 * it displays the current page and the total number of pages
 *
 * props:
 * currentPage-> <number> tells the current page being displayed
 * rowsPerPage-> <number>tells the number of posts displayed at once
 * totalRows -> <number>tells the total number of rows for the fetched data
 * options -> [Number] tells the list of values in the drop down list, these values are
 *            use for setting rows per page
 * setRowsPerPage-> function to handle when an option is select from drop down lists
 * paginate->its a function for handling page change
 */

import React, { FC, useEffect, useState } from "react";

interface PaginateComponentProps {
  initialPage: number;
  initialSize: number;
  totalRows: number;
  paginateCallback: Function;
  options?: Array<number>;
}

const PaginateComponent: FC<PaginateComponentProps> = ({
  initialSize = 10,
  totalRows = 0,
  paginateCallback,
  options = [5, 10, 20, 50, 100],
}) => {
  const [currentPage, setCurrentPage] = useState(totalRows === 0 ? 0 : 1);
  const [rowsPerPage, setRowsPerPage] = useState(initialSize);
  useEffect(() => {
    paginateCallback({
      page: document.querySelector("#pagination-currnt-page")?.value,
      size: document.querySelector("#pagination-rows-per-page")?.value,
    });
  }, [currentPage, rowsPerPage]);
  return (
    <div className="sonic-table-paginate .bg-light">
      {/* drop down list*/}
      <select
        typeof="number"
        className="sonic-table-input sonic-table-pg-select"
        id="pagination-rows-per-page"
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(e.target.value);
          setCurrentPage(totalRows === 0 ? 0 : 1);
        }}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            show {option}
          </option>
        ))}
      </select>
      <div className="sonic-table-controls">
        <input
          id="pagination-currnt-page"
          type="number"
          value={currentPage}
          style={{ display: "none" }}
          onChange={(e) => console.log(e)}
        />
        <span>
          {currentPage} of {Math.ceil(totalRows / rowsPerPage)}
        </span>
        <button
          className="sonic-table-pag-btn sonic-table-prv-button bg-light border-none"
          onClick={() => {
            currentPage === 1
              ? setCurrentPage(Math.ceil(totalRows / rowsPerPage)) // go to last page
              : setCurrentPage(currentPage - 1);
          }}
        >
          &lt;
        </button>

        <button
          className="sonic-table-pag-btn sonic-table-nxt-button bg-light border-none"
          onClick={() =>
            currentPage === Math.ceil(totalRows / rowsPerPage)
              ? setCurrentPage(1) //go to first page
              : setCurrentPage(currentPage + 1)
          }
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PaginateComponent;
