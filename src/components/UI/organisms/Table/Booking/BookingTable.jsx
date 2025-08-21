import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { format } from "date-fns";
import { formatThousandSeparator } from "../../../../../utils/utils/formatThousandSeparator";
import { formatInTimeZone } from "date-fns-tz";

const BookingTable = ({
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
  doPrint,
  doHelp,
  doNote,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      // {
      //   accessorKey: "booking_code",
      //   header: "Booking Code",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "user_fullname",
        header: "Full Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "user_displayname",
        header: "Display Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "booking_start",
        header: "Booking Start",
        Cell: ({ cell }) =>
          formatInTimeZone(
            new Date(cell.getValue()),
            "UTC",
            "dd MMMM yyyy HH:mm"
          ) || "-",

        size: 50,
      },
      {
        accessorKey: "booking_end",
        header: "Booking End",
        Cell: ({ cell }) =>
          formatInTimeZone(
            new Date(cell.getValue()),
            "UTC",
            "dd MMMM yyyy HH:mm"
          ) || "-",
        size: 50,
      },
      {
        accessorKey: "booking_duration",
        header: "Duration (min)",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 50,
      },
      {
        accessorKey: "promo_name",
        header: "Promo Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 50,
      },
      {
        accessorKey: "promo_source",
        header: "Promo Source",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 50,
      },
      {
        accessorKey: "promo_percentage",
        header: "Promo %",
        Cell: ({ cell }) => cell.getValue() + " %" || "-",
        size: 50,
      },
      {
        accessorKey: "promo_flat",
        header: "Promo Flat",
        Cell: ({ cell }) => formatThousandSeparator(cell.getValue()) || "-",
        size: 50,
      },

      {
        accessorKey: "user_phone",
        header: "Phone",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "seat_code",
        header: "Seat Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "bracelet_code",
        header: "Bracelet Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "event_ticket_total",
        header: "Event Ticket Total",
        Cell: ({ cell }) => formatThousandSeparator(cell.getValue()) || "-",
        size: 100,
      },
      {
        accessorKey: "booking_payment_method",
        header: "Payment Method",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "booking_payment_discount",
        header: "Payment Discount",
        Cell: ({ cell }) => formatThousandSeparator(cell.getValue()) || "-",
        size: 100,
      },
      {
        accessorKey: "booking_payment_total",
        header: "Payment Total",
        Cell: ({ cell }) => formatThousandSeparator(cell.getValue()) || "-",
        size: 100,
      },
      {
        accessorKey: "booking_payment_price",
        header: "Payment Price",
        Cell: ({ cell }) => formatThousandSeparator(cell.getValue()) || "-",
        size: 100,
      },
      {
        accessorKey: "booking_created",
        header: "Booking Created",
        Cell: ({ cell }) =>
          formatInTimeZone(
            new Date(cell.getValue()),
            "UTC",
            "dd MMMM yyyy HH:mm:ss"
          ) || "-",
        size: 200,
      },
      {
        accessorKey: "latest_note",
        header: "Latest Note",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 80,
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <IconButton
              color="primary"
              onClick={() => doNote && doNote(row.original)}
            >
              <Tooltip title="Show Note">
                <Box
                  component="img"
                  alt="note"
                  src="https://api.iconify.design/material-symbols:edit-note.svg"
                  sx={{
                    width: "20px",
                    height: "20px",
                  }}
                />
              </Tooltip>
            </IconButton>
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
          </div>
        ),
      },
    ],
    []
  );
  return (
    <div>
      <DefaultTable
        tableTitle="Booking List"
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

export default BookingTable;
