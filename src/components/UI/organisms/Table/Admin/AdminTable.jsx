import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { Button, IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { BasicButton } from "../../../atoms/BasicButton";

const AdminTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doDownload,
  doAdd,
  doEdit,
  doDelete,
  doUnsuspend,
  doHelp,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "admin_code",
        header: "Admin Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "admin_loginname",
        header: "Login Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "admin_displayname",
        header: "Display Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "admin_first_login_pass",
        header: "First Login Pass",
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        size: 200,
      },
      // {
      //   accessorKey: "admin_role_code",
      //   header: "Role Code",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "admin_created",
      //   header: "Created At",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "admin_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "admin_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "admin_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "admin_status", // please change to switch with function doDelete, the value is "1" and "0". please make "1" to true and "0" false.
      //   header: "Status",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 150,
      // },
      {
        accessorKey: "admin_status",
        header: "Status",
        Cell: ({ row }) => {
          if (row.original.admin_status === -1) {
            return (
              <BasicButton
                onClick={() => doUnsuspend && doUnsuspend(row.original)}
                sx={{
                  backgroundColor: "#1976d2", // MUI default primary blue
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#115293", // Darker blue on hover
                    color: "#ffffff",
                  },
                  padding: "10px 10px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Unsuspend
              </BasicButton>
            );
          } else {
            return (
              <Switch
                checked={row.original.admin_status === 1}
                onChange={() => doDelete && doDelete(row.original)}
                color="primary"
              />
            );
          }
        },
        size: 150,
      },
      // {
      //   accessorKey: "admin_status_str",
      //   header: "Status String",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 150,
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
        tableTitle="Admin List"
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

export default AdminTable;
