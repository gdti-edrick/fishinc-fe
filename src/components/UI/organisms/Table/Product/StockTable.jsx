import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { Box, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Text } from "../../../atoms/Typography";
import { BasicButton } from "../../../atoms/BasicButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const StockTable = ({
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
  doStock,
  doRefresh,
  doBack,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "product_stock_code",
        header: "Stock Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "product_code",
        header: "Product Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "product_name",
        header: "Product Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "product_category_code",
        header: "Category Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "vendor_code",
        header: "Vendor Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "market_code",
        header: "Market Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "redeem_code",
        header: "Redeem Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },

      {
        accessorKey: "product_stock_qty",
        header: "Stock Quantity",
        Cell: ({ cell }) => cell.getValue() || 0,
        size: 80,
      },
      {
        accessorKey: "product_stock_buy",
        header: "Buy Price",
        Cell: ({ cell }) => `Rp ${cell.getValue()?.toLocaleString() || 0}`,
        size: 100,
      },
      {
        accessorKey: "product_stock_discount",
        header: "Discount",
        Cell: ({ cell }) => `Rp ${cell.getValue()?.toLocaleString() || 0}`,
        size: 80,
      },
      {
        accessorKey: "product_stock_price",
        header: "Selling Price",
        Cell: ({ cell }) => `Rp ${cell.getValue()?.toLocaleString() || 0}`,
        size: 100,
      },
      {
        accessorKey: "product_stock_price_total",
        header: "Total Price",
        Cell: ({ cell }) => `Rp ${cell.getValue()?.toLocaleString() || 0}`,
        size: 100,
      },

      // {
      //   accessorKey: "product_stock_created",
      //   header: "Created At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "product_stock_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
      // {
      //   accessorKey: "product_stock_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "product_stock_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
      {
        accessorKey: "product_stock_status",
        header: "Status",
        Cell: ({ cell }) => (cell.getValue() === 1 ? "Active" : "Inactive"),
        size: 80,
      },
      {
        accessorKey: "product_stock_desc",
        header: "Note",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
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
        tableTitle={
          <Box sx={{ display: "flex", flexDirection: "row", gap: "16px" }}>
            <BasicButton onClick={doBack} sx={{}}>
              <ArrowBackIcon sx={{ width: "24px", height: "24px" }} />
            </BasicButton>
            <Text variant="h5" sx={{ fontWeight: 600 }}>
              Stock List
            </Text>
          </Box>
        }
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doDownload={doDownload}
        doAdd={doAdd}
        doRefresh={doRefresh}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default StockTable;
