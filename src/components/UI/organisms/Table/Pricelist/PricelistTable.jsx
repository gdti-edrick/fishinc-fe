import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { format } from "date-fns";

const PricelistTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
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
        accessorKey: "pricelist_code",
        header: "Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 120,
      },
      {
        accessorKey: "pricelist_name",
        header: "Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 160,
      },
      {
        accessorKey: "pricelist_price",
        header: "Price",
        Cell: ({ cell }) =>
          cell.getValue() != null
            ? `Rp${cell.getValue().toLocaleString()}`
            : "-",
        size: 120,
      },
      {
        accessorKey: "pricelist_start",
        header: "Start Hour",
        Cell: ({ cell }) => cell.getValue() ?? "-",
        size: 100,
      },
      {
        accessorKey: "pricelist_end",
        header: "End Hour",
        Cell: ({ cell }) => cell.getValue() ?? "-",
        size: 100,
      },
      {
        accessorKey: "pricelist_sunday",
        header: "Sun",
        Cell: ({ cell }) => (cell.getValue() ? "✓" : "-"),
        size: 60,
      },
      {
        accessorKey: "pricelist_monday",
        header: "Mon",
        Cell: ({ cell }) => (cell.getValue() ? "✓" : "-"),
        size: 60,
      },
      {
        accessorKey: "pricelist_tuesday",
        header: "Tue",
        Cell: ({ cell }) => (cell.getValue() ? "✓" : "-"),
        size: 60,
      },
      {
        accessorKey: "pricelist_wednesday",
        header: "Wed",
        Cell: ({ cell }) => (cell.getValue() ? "✓" : "-"),
        size: 60,
      },
      {
        accessorKey: "pricelist_thursday",
        header: "Thu",
        Cell: ({ cell }) => (cell.getValue() ? "✓" : "-"),
        size: 60,
      },
      {
        accessorKey: "pricelist_friday",
        header: "Fri",
        Cell: ({ cell }) => (cell.getValue() ? "✓" : "-"),
        size: 60,
      },
      {
        accessorKey: "pricelist_saturday",
        header: "Sat",
        Cell: ({ cell }) => (cell.getValue() ? "✓" : "-"),
        size: 60,
      },
      // {
      //   accessorKey: "pricelist_created",
      //   header: "Created At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 180,
      // },
      // {
      //   accessorKey: "pricelist_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 160,
      // },
      // {
      //   accessorKey: "pricelist_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 180,
      // },
      // {
      //   accessorKey: "pricelist_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 160,
      // },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 100,
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
        tableTitle="Pricelist"
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

export default PricelistTable;
