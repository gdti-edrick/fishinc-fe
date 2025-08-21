import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton, Switch } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const WeightTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  doDownload,
  doAdd,
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
        accessorKey: "weight_code",
        header: "Weight Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "user_fullname",
        header: "Full Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "user_displayname",
        header: "Display Name",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
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
        size: 100,
      },
      {
        accessorKey: "user_email",
        header: "Email",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "bracelet_code",
        header: "Bracelet Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "scale_code",
        header: "Scale Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "weight_number",
        header: "Weight Number",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      // {
      //   accessorKey: "weight_uid_req",
      //   header: "Weight UID Req",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "weight_uid_res",
      //   header: "Weight UID Res",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "weight_created",
        header: "Created At",
        Cell: ({ cell }) =>
          formatInTimeZone(
            new Date(cell.getValue()),
            "UTC",
            "dd MMMM yyyy HH:mm:ss"
          ) || "-",
        size: 200,
      },
      // {
      //   accessorKey: "weight_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "weight_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) =>
      //     cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "weight_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "weight_status",
      //   header: "Status",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 80,
      // },
      {
        accessorKey: "weight_status",
        header: "Status",
        Cell: ({ row }) => (
          <Switch
            checked={row.original.weight_status}
            onChange={() => doDelete && doDelete(row.original)}
            color="primary"
          />
        ),
        size: 150,
      },
      // {
      //   accessorKey: "weight_status_str",
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
        tableTitle="Weight List"
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

export default WeightTable;
