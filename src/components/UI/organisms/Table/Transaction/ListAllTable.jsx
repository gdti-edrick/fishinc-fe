import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";

const ListAllTable = ({
  tableTitle,
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doDownload,
  doAdd,
  doEdit,
  doDelete,
  start,
  doStart,
  end,
  doEnd,
  doDetail,
  doPrint,
  doHelp,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "transaction_code",
        header: "Transaction Code",
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
        size: 250,
      },
      {
        accessorKey: "transaction_date",
        header: "Transaction Date",
        Cell: ({ row, cell }) => (
          <div
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
              // color: "blue",
            }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {formatInTimeZone(
              new Date(cell.getValue()),
              "UTC",
              "dd MMMM yyyy HH:mm:ss"
            ) || "-"}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "transaction_method",
        header: "Transaction Method",
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
        size: 150,
      },
      {
        accessorKey: "transaction_idr",
        header: "Transaction Amount (IDR)",
        Cell: ({ row, cell }) => (
          <div
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
              // color: "blue",
            }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {`Rp ${cell.getValue()?.toLocaleString() ?? 0}` || "-"}
          </div>
        ),
        // Cell: ({row, cell}) =>
        //   `Rp ${cell.getValue()?.toLocaleString() ?? 0}` || "-",
        size: 200,
      },
      {
        accessorKey: "transaction_point",
        header: "Transaction Points",

        Cell: ({ row, cell }) => (
          <div
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
              // color: "blue",
            }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "0"}
          </div>
        ),
        // Cell: ({row, cell}) => cell.getValue() || "0",
        size: 150,
      },
      {
        accessorKey: "transaction_created",
        header: "Created At",
        Cell: ({ cell }) =>
          formatInTimeZone(
            new Date(cell.getValue()),
            "UTC",
            "dd MMMM yyyy HH:mm:ss"
          ) || "-",
        size: 200,
      },
      // {
      //   accessorKey: "transaction_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "transaction_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue())?.toLocaleString() : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "transaction_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 80,
        Cell: ({ row, cell }) => (
          <div style={{ display: "flex", gap: "8px" }}>
            {row.original.transaction_method !== "POINT" && (
              <IconButton
                color="primary"
                onClick={() => doPrint && doPrint(row.original)}
              >
                <Tooltip title="Print">
                  <Box
                    component="img"
                    alt="reprint"
                    src="https://api.iconify.design/mingcute:print-fill.svg"
                    sx={{
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </Tooltip>
              </IconButton>
            )}
          </div>
        ),
      },
    ],
    []
  );
  return (
    <div>
      <DefaultTable
        tableTitle={tableTitle}
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doDownload={doDownload}
        doAdd={doAdd}
        start={start}
        doStart={doStart}
        end={end}
        doEnd={doEnd}
        doHelp={doHelp}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default ListAllTable;
