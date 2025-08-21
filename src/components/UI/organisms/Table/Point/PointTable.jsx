import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const PointTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doDownload,
  doAdd,
  // doEdit,
  // doDelete,
  doDetail,
  doHelp,
  pagination,
  setPagination,
  search,
  setSearch,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "point_code",
        header: "Point Code",
        Cell: ({ row, cell }) => (
          <div
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
              // color: "blue",
            }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "user_fullname",
        header: "Full Name",
        Cell: ({ row, cell }) => (
          <div
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
              // color: "blue",
            }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "user_displayname",
        header: "Display Name",
        Cell: ({ row, cell }) => (
          <div
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
              // color: "blue",
            }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "user_countrycode",
        header: "Country Code",
        Cell: ({ row, cell }) => (
          <div
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
              // color: "blue",
            }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 80,
      },
      {
        accessorKey: "user_phone",
        header: "Phone",
        Cell: ({ row, cell }) => (
          <div
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
              // color: "blue",
            }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "user_email",
        header: "Email",
        Cell: ({ row, cell }) => (
          <div
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
              // color: "blue",
            }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "point_total_after",
        header: "Point Total After",
        Cell: ({ row, cell }) => (
          <div
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
              // color: "blue",
            }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 80,
      },
    ],
    []
  );
  return (
    <div>
      <DefaultTable
        tableTitle="Point List"
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doDownload={doDownload}
        doAdd={doAdd}
        doHelp={doHelp}
        pagination={pagination}
        setPagination={setPagination}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
};

export default PointTable;
