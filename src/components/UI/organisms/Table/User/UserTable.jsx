import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const UserTable = ({
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
  search,
  setSearch,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "user_code",
        header: "User Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 120,
      },
      {
        accessorKey: "user_fullname",
        header: "Full Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 120,
      },
      {
        accessorKey: "user_displayname",
        header: "Display Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 120,
      },
      {
        accessorKey: "user_countrycode",
        header: "Country Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "user_phone",
        header: "Phone",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "user_email",
        header: "Email",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "user_verified",
        header: "Verified",
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        size: 80,
      },
      {
        accessorKey: "user_verification_code",
        header: "Verification",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "user_verification_expired",
        header: "Expiry",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      // {
      //   accessorKey: "user_created",
      //   header: "Created At",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "user_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "user_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "user_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "user_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.user_status === 1}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 150,
      },
      // {
      //   accessorKey: "user_status",
      //   header: "Status",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 100,
      // },
      // {
      //   accessorKey: "user_status_str",
      //   header: "Status String",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 100,
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
            {/* <IconButton
              color="red"
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
        tableTitle="User List"
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doDownload={doDownload}
        doAdd={doAdd}
        doHelp={doHelp}
        pagination={pagination}
        setPagination={setPagination}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
};

export default UserTable;
