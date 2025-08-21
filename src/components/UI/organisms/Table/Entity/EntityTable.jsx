import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const EntityTable = ({
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
        accessorKey: "entity_code",
        header: "Entity Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "entity_sort",
        header: "Entity Sort",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      // {
      //   accessorKey: "entity_created",
      //   header: "Entity Created",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "entity_created_by",
      //   header: "Entity Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "entity_updated",
      //   header: "Entity Updated",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "entity_updated_by",
      //   header: "Entity Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "entity_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.entity_status === 1}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 150,
      },
      // {
      //   accessorKey: "entity_status",
      //   header: "Entity Status",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 150,
      // },
      // {
      //   accessorKey: "entity_status_str",
      //   header: "Entity Status Str",
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
        tableTitle="Entity List"
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

export default EntityTable;
