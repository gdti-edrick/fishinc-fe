import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { format } from "date-fns";

const HolidayTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
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
        accessorKey: "holiday_code",
        header: "Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 120,
      },
      {
        accessorKey: "holiday_name",
        header: "Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 180,
      },
      {
        accessorKey: "holiday_date",
        header: "Date",
        Cell: ({ cell }) =>
          cell.getValue()
            ? format(new Date(cell.getValue()), "dd/MM/yyyy")
            : "-",
        size: 120,
      },
      {
        accessorKey: "holiday_note",
        header: "Note",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "holiday_created",
        header: "Created At",
        Cell: ({ cell }) =>
          cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
        size: 180,
      },
      // {
      //   accessorKey: "holiday_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 180,
      // },
      // {
      //   accessorKey: "holiday_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 180,
      // },
      // {
      //   accessorKey: "holiday_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 180,
      // },
      {
        accessorKey: "holiday_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.holiday_status === 1}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 100,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 100,
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
        tableTitle="Holiday List"
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

export default HolidayTable;
