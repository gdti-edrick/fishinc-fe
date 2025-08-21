import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const AdminRoleTable = ({
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
        accessorKey: "admin_role_code",
        header: "Role Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "admin_role_desc",
        header: "Role Description",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 250,
      },
      // {
      //   accessorKey: "admin_role_created",
      //   header: "Created At",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "admin_role_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "admin_role_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "admin_role_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "admin_role_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.admin_role_status === 1}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 150,
      },
      // {
      //   accessorKey: "admin_role_status_str",
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
        tableTitle="Admin Role List"
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

export default AdminRoleTable;
