import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { Box, Button, IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Text } from "../../../atoms/Typography";
import { BasicButton } from "../../../atoms/BasicButton";

const ProductTable = ({
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
  doAddStock,
  doRefresh,
  doHelp,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "product_code",
        header: "Product Code",
        Cell: ({ row, cell }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "product_name",
        header: "Product Name",
        Cell: ({ row, cell }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => doDetail && doDetail(row.original)}
          >
            {cell.getValue() || "-"}
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "product_category_code",
        header: "Category Code",
        Cell: ({ row, cell }) => <div>{cell.getValue() || "-"}</div>,
        size: 100,
      },
      {
        accessorKey: "product_price_idr",
        header: "Price (IDR)",
        Cell: ({ row, cell }) => (
          <div>Rp {cell.getValue().toLocaleString()}</div>
        ),
        size: 80,
      },
      {
        accessorKey: "product_price_point",
        header: "Price (Points)",
        Cell: ({ row, cell }) => <div>{cell.getValue().toLocaleString()}</div>,
        size: 80,
      },
      {
        accessorKey: "product_stock",
        header: "Stock",
        Cell: ({ row, cell }) => <div>{cell.getValue().toLocaleString()}</div>,
        size: 80,
      },
      // {
      //   accessorKey: "product_created",
      //   header: "Created At",
      //   Cell: ({ row, cell }) => (
      //     <div>
      //       {cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-"}
      //     </div>
      //   ),
      //   size: 180,
      // },
      // {
      //   accessorKey: "product_created_by",
      //   header: "Created By",
      //   Cell: ({ row, cell }) => <div>{cell.getValue() || "-"}</div>,
      //   size: 200,
      // },
      // {
      //   accessorKey: "product_updated",
      //   header: "Updated At",
      //   Cell: ({ row, cell }) => (
      //     <div>
      //       {cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-"}
      //     </div>
      //   ),
      //   size: 180,
      // },
      // {
      //   accessorKey: "product_updated_by",
      //   header: "Updated By",
      //   Cell: ({ row, cell }) => <div>{cell.getValue() || "-"}</div>,
      //   size: 200,
      // },
      {
        accessorKey: "product_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.product_status === 1}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 80,
      },
      // {
      //   accessorKey: "product_status_str",
      //   header: "Status",
      //   Cell: ({ row, cell }) => <div>{cell.getValue()}</div>,
      //   size: 80,
      // },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 80,
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <IconButton
              color="primary"
              onClick={() => doEdit && doEdit(row.original)}
            >
              <Tooltip title="Edit">
                <Edit />
              </Tooltip>
            </IconButton>
            <Button
              onClick={() => doAddStock && doAddStock(row.original)}
              // sx={{
              //   color: "#FDB614",
              //   fontWeight: 900,
              //   "&:hover": { boxShadow: "0 4px 12px rgba(253, 182, 20, 0.4)" },
              // }}
            >
              Add Stock
            </Button>
            {/* <IconButton
              color="error"
              onClick={() => doDelete && doDelete(row.original)}
            >
              <Delete />
            </IconButton> */}
          </div>
        ),
      },
    ],
    []
  );
  return (
    <div>
      <DefaultTable
        tableTitle={
          <Box sx={{ display: "flex", flexDirection: "row", gap: "16px" }}>
            <Text variant="h5" sx={{ fontWeight: 600 }}>
              Product List
            </Text>
            <BasicButton onClick={doStock} sx={{ border: "1px solid gray" }}>
              Stock
            </BasicButton>
          </Box>
        }
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doDownload={doDownload}
        doRefresh={doRefresh}
        doAdd={doAdd}
        doHelp={doHelp}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default ProductTable;
