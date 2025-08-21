import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const VendorTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
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
        accessorKey: "vendor_code",
        header: "Vendor Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "vendor_name",
        header: "Vendor Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 250,
      },
      {
        accessorKey: "vendor_desc",
        header: "Description",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 300,
      },
      // {
      //   accessorKey: "vendor_created",
      //   header: "Created At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "vendor_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
      // {
      //   accessorKey: "vendor_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "vendor_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 250,
      // },
      {
        accessorKey: "vendor_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.vendor_status === 1}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 80,
      },
      // {
      //   accessorKey: "vendor_status",
      //   header: "Status",
      //   Cell: ({ cell }) => (cell.getValue() === 1 ? "Active" : "Inactive"),
      //   size: 150,
      // },
      // {
      //   accessorKey: "vendor_status_str",
      //   header: "Status String",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
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
        tableTitle="Vendor List"
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

export default VendorTable;
