import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { format } from "date-fns";

const GameTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doDownload,
  doAdd,
  doEdit,
  doDelete,
  doHelp,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "game_code",
        header: "Game Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "game_name",
        header: "Game Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "game_desc",
        header: "Description",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "game_start",
        header: "Game Start",
        Cell: ({ cell }) =>
          cell.getValue()
            ? format(new Date(cell.getValue()).toLocaleString(), "dd MMM yyyy")
            : "-",
        size: 80,
      },
      {
        accessorKey: "game_end",
        header: "Game End",
        Cell: ({ cell }) =>
          cell.getValue()
            ? format(new Date(cell.getValue()).toLocaleString(), "dd MMM yyyy")
            : "-",
        size: 80,
      },
      {
        accessorKey: "game_point",
        header: "Points",
        Cell: ({ cell }) => cell.getValue() || "0",
        size: 80,
      },
      // {
      //   accessorKey: "game_created",
      //   header: "Created At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "game_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
      // {
      //   accessorKey: "game_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "game_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
      {
        accessorKey: "game_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.game_status === 1}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 80,
      },
      // {
      //   accessorKey: "game_status",
      //   header: "Status",
      //   Cell: ({ cell }) => (cell.getValue() === 1 ? "Active" : "Inactive"),
      //   size: 80,
      // },
      // {
      //   accessorKey: "game_status_str",
      //   header: "Status String",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <IconButton
              color="primary"
              onClick={() => doEdit && doEdit(row.original)}
            >
              <Tooltip title="Edit">
                <Edit />
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
        tableTitle="Game List"
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doDownload={doDownload}
        doAdd={doAdd}
        doHelp={doHelp}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default GameTable;
