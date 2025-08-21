import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { formatThousandSeparator } from "../../../../../utils/utils/formatThousandSeparator";

const ProductDetailTable = ({
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
        accessorKey: "product_stock_code",
        header: "Stock Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "vendor_code",
        header: "Vendor Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "transaction_code",
        header: "Transaction Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 180,
      },

      {
        accessorKey: "product_stock_qty",
        header: "Quantity",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 50,
      },
      {
        accessorKey: "product_stock_buy",
        header: "Buy Price",
        Cell: ({ cell }) => formatThousandSeparator(cell.getValue()) || "-",
        size: 100,
      },
      {
        accessorKey: "product_stock_discount",
        header: "Discount",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "product_stock_price",
        header: "Selling Price",
        Cell: ({ cell }) => formatThousandSeparator(cell.getValue()) || "-",
        size: 100,
      },
      {
        accessorKey: "product_stock_price_total",
        header: "Total Price",
        Cell: ({ cell }) => formatThousandSeparator(cell.getValue()) || "-",
        size: 100,
      },

      // {
      //   accessorKey: "product_stock_created",
      //   header: "Created At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? format(new Date(cell.getValue()), "dd-MM-yyyy HH:mm:ss") : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "product_stock_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "product_stock_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? format(new Date(cell.getValue()), "dd-MM-yyyy HH:mm:ss") : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "product_stock_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "product_stock_status",
        header: "Status",
        Cell: ({ cell }) => (cell.getValue() === 1 ? "Active" : "Inactive"),
        size: 100,
      },
      {
        accessorKey: "product_stock_desc",
        header: "Note",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 250,
      },
      // {
      //   accessorKey: "product_stock_status_str",
      //   header: "Status String",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
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

export default ProductDetailTable;
