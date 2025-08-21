import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { formatThousandSeparator } from "../../../../../utils/utils/formatThousandSeparator";

const TransactionDetailTable = ({
  tableTitle,
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
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "transaction_item_code",
        header: "Transaction Item Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "transaction_code",
        header: "Transaction Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "product_code",
        header: "Product Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "product_name",
        header: "Product Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "product_price_point",
        header: "Price Point",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "transaction_item_qty",
        header: "Quantity",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "transaction_item_point",
        header: "Item Point",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      // {
      //   accessorKey: "transaction_item_created",
      //   header: "Created At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? format(new Date(cell.getValue()), "dd-MM-yyyy HH:mm:ss") : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "transaction_item_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
      // {
      //   accessorKey: "transaction_item_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? format(new Date(cell.getValue()), "dd-MM-yyyy HH:mm:ss") : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "transaction_item_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
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
      />
    </div>
  );
};

export default TransactionDetailTable;
