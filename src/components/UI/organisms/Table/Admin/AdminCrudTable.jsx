import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";

const AdminCrudTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doEdit,
  doDownload,
  doHelp,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "admin_crud_code",
        header: "Admin CRUD Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "admin_role_code",
        header: "Admin Role Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 120,
      },
      {
        accessorKey: "entity_code",
        header: "Entity Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 120,
      },
      {
        accessorKey: "admin_crud_permission_c",
        header: "Create",
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        size: 80,
      },
      {
        accessorKey: "admin_crud_permission_r",
        header: "Read",
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        size: 80,
      },
      {
        accessorKey: "admin_crud_permission_u",
        header: "Update",
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        size: 80,
      },
      {
        accessorKey: "admin_crud_permission_d",
        header: "Delete",
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        size: 80,
      },
      // {
      //   accessorKey: "admin_crud_created",
      //   header: "Created At",
      //   Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "admin_crud_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 150,
      // },
      // {
      //   accessorKey: "admin_crud_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "admin_crud_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 150,
      // },
      // {
      //   accessorKey: "admin_crud_status",
      //   header: "Status",
      //   Cell: ({ cell }) => (cell.getValue() === 1 ? "Active" : "Inactive"),
      //   size: 80,
      // },
      // {
      //   accessorKey: "admin_crud_status_str",
      //   header: "Status",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 80,
      // },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 80,
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
        tableTitle="Admin CRUD List"
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doDownload={doDownload}
        doHelp={doHelp}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default AdminCrudTable;
