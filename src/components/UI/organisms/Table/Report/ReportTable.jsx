import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ReportTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doDownload,
  doAdd,
  // doEdit,
  // doDelete,
  start,
  doStart,
  end,
  doEnd,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "booking_code",
        header: "Booking Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "booking_start",
        header: "Booking Start",
        Cell: ({ cell }) =>
          cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
        size: 200,
      },
      {
        accessorKey: "booking_end",
        header: "Booking End",
        Cell: ({ cell }) =>
          cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
        size: 200,
      },
      {
        accessorKey: "booking_duration",
        header: "Duration (Minutes)",
        Cell: ({ cell }) => cell.getValue() || "0",
        size: 150,
      },
      {
        accessorKey: "user_fullname",
        header: "Full Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "user_displayname",
        header: "Display Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "user_phone",
        header: "Phone",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "seat_code",
        header: "Seat Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "bracelet_code",
        header: "Bracelet Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "event_index",
        header: "Event Index",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "event_code",
        header: "Event Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "event_ticket_total",
        header: "Ticket Total",
        Cell: ({ cell }) => cell.getValue() || "0",
        size: 150,
      },
      {
        accessorKey: "booking_payment_method",
        header: "Payment Method",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "booking_payment_price",
        header: "Payment Price",
        Cell: ({ cell }) => `Rp ${cell.getValue()?.toLocaleString() || "0"}`,
        size: 200,
      },
      // {
      //   accessorKey: "booking_created",
      //   header: "Created At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 200,
      // },
    ],
    []
  );
  return (
    <div>
      <DefaultTable
        tableTitle="Report List"
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
      />
    </div>
  );
};

export default ReportTable;
