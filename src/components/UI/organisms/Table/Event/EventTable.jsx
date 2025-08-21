import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { format } from "date-fns";

const EventTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doDownload,
  doAdd,
  doEdit,
  doDelete,
  doDetail,
  doHelp,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "event_code",
        header: "Event Code",
        Cell: ({ row, cell }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "event_name",
        header: "Event Name",
        Cell: ({ row, cell }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: "event_desc",
        header: "Description",
        Cell: ({ row, cell }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 180,
      },
      {
        accessorKey: "event_start",
        header: "Start Date",
        Cell: ({ row, cell }) => (
          <div>
            {cell.getValue()
              ? format(new Date(cell.getValue()), "dd/MM/yyyy")
              : "-"}
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: "event_end",
        header: "End Date",
        Cell: ({ row, cell }) => (
          <div>
            {cell.getValue()
              ? format(new Date(cell.getValue()), "dd/MM/yyyy")
              : "-"}
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: "event_ticket_price",
        header: "Ticket Price",
        Cell: ({ row, cell }) => (
          <div>Rp {cell.getValue().toLocaleString()}</div>
        ),
        size: 120,
      },
      {
        accessorKey: "event_ticket_discount",
        header: "Discount",
        Cell: ({ row, cell }) => <div>{cell.getValue()}%</div>,
        size: 80,
      },
      {
        accessorKey: "event_ticket_total",
        header: "Total Tickets",
        Cell: ({ row, cell }) => (
          <div>Rp {cell.getValue().toLocaleString()}</div>
        ),
        size: 100,
      },
      // {
      //   accessorKey: "event_created",
      //   header: "Created At",
      //   Cell: ({ row, cell }) => (
      //     <div>
      //       {cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-"}
      //     </div>
      //   ),
      //   size: 180,
      // },
      // {
      //   accessorKey: "event_updated",
      //   header: "Updated At",
      //   Cell: ({ row, cell }) => (
      //     <div>
      //       {cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-"}
      //     </div>
      //   ),
      //   size: 180,
      // },
      {
        accessorKey: "event_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.event_status === 1}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 80,
      },
      // {
      //   accessorKey: "event_status_str",
      //   header: "Status",
      //   Cell: ({ row, cell }) => <div>{cell.getValue()}</div>,
      //   size: 80,
      // },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 120,
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
        tableTitle="Event List"
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

export default EventTable;
