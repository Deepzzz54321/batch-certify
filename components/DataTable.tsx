import React, { PropsWithChildren } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  TableOptions,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { PaginationItem, PaginationLink } from "reactstrap";
import Icon from "./Icon";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <input
      className="d-inline form-control"
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search ${count} records...`}
      style={{ width: "auto" }}
    />
  );
}

const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
}: PropsWithChildren<TableOptions<T>>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable<T>(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      <div className="table-responsive">
        <table {...getTableProps()} className="table table-hover">
          <thead className="thead-light">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="align-middle"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <Icon
                            name="arrow-down-line"
                            style={{ fontSize: "0.7rem" }}
                          />
                        ) : (
                          <Icon
                            name="arrow-up-line"
                            style={{ fontSize: "0.7rem" }}
                          />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="d-md-flex text-center justify-content-between m-3">
        <div className="pagination justify-content-center">
          <PaginationItem
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <PaginationLink>
              <Icon name="arrow-left-line" style={{ fontSize: "1.1rem" }} />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <PaginationLink>
              <Icon name="arrow-left-s-line" style={{ fontSize: "1.1rem" }} />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem className="active">
            <PaginationLink>{pageIndex + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem onClick={() => nextPage()} disabled={!canNextPage}>
            <PaginationLink>
              <Icon name="arrow-right-s-line" style={{ fontSize: "1.1rem" }} />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <PaginationLink>
              <Icon name="arrow-right-line" style={{ fontSize: "1.1rem" }} />
            </PaginationLink>
          </PaginationItem>
        </div>
        <div className="mt-3 mt-md-0">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
      </div>
    </>
  );
};

export default DataTable;
