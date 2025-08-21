import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const EventDetailTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doDownload,
  doAdd,
  doEdit,
  doDelete,
}) => {
  const columns = useMemo(
    () => [
      // {
      //   accessorKey: "event_point_code",
      //   header: "Event Point Code",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
      {
        accessorKey: "event_code",
        header: "Event Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "event_point_min_weight",
        header: "Min Weight",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "event_point_max_weight",
        header: "Max Weight",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "event_point_sum_point",
        header: "Total Points",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      // {
      //   accessorKey: "event_point_created",
      //   header: "Created At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "event_point_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
      // {
      //   accessorKey: "event_point_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "event_point_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
      {
        accessorKey: "event_point_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.event_point_status === 1}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 150,
      },
      // {
      //   accessorKey: "event_point_status",
      //   header: "Status",
      //   Cell: ({ cell }) => (cell.getValue() === 1 ? "Active" : "Inactive"),
      //   size: 150,
      // },
      // {
      //   accessorKey: "event_point_status_str",
      //   header: "Status String",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 150,
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
        tableTitle="Weight Point List"
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doDownload={doDownload}
        doAdd={doAdd}
      />
    </div>
  );
};

export default EventDetailTable;
