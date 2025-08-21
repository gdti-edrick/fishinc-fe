import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch, Tooltip } from "@mui/material";
import { Dangerous } from "@mui/icons-material";

const PromoTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doAdd,
  doDownload,
  doDelete,
  doHelp,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      // {
      //   accessorKey: "promo_code",
      //   header: "Promo Code",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 180,
      // },
      {
        accessorKey: "promo_name",
        header: "Promo Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 220,
      },
      {
        accessorKey: "promo_source",
        header: "Source",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 180,
      },
      {
        accessorKey: "promo_percentage",
        header: "Discount (%)",
        Cell: ({ cell }) => (cell.getValue() ? `${cell.getValue()}%` : "-"),
        size: 150,
      },
      {
        accessorKey: "promo_flat",
        header: "Flat Discount",
        Cell: ({ cell }) => (cell.getValue() ? `Rp${cell.getValue()}` : "-"),
        size: 150,
      },
      {
        accessorKey: "promo_expired",
        header: "Expired At",
        Cell: ({ cell }) =>
          cell.getValue()
            ? new Date(cell.getValue()).toLocaleDateString()
            : "-",
        size: 180,
      },
      {
        accessorKey: "promo_infinite",
        header: "Infinite?",
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        size: 120,
      },
      {
        accessorKey: "promo_status_str",
        header: "Status",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "promo_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.promo_status === 1}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 80,
      },
    ],
    []
  );
  return (
    <div>
      <DefaultTable
        tableTitle="Promo List"
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doAdd={doAdd}
        doDownload={doDownload}
        doHelp={doHelp}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default PromoTable;
