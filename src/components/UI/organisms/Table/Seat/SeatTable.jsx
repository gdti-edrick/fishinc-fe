import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Tooltip } from "@mui/material";
import { Dangerous } from "@mui/icons-material";

const SeatTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doDownload,
  doDelete,
  doHelp,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "seat_code",
        header: "Seat Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      // {
      //   accessorKey: "seat_created",
      //   header: "Seat Created",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "seat_created_by",
      //   header: "Seat Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "seat_updated",
      //   header: "Seat Updated",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "seat_updated_by",
      //   header: "Seat Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "seat_status_str",
        header: "Seat Status",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <IconButton
              color="primary"
              onClick={() => doDelete && doDelete(row.original)}
            >
              <Tooltip title="Stop">
                <Dangerous />
              </Tooltip>
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );
  return (
    <div>
      <DefaultTable
        tableTitle="Seat List"
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doDownload={doDownload}
        doHelp={doHelp}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default SeatTable;
