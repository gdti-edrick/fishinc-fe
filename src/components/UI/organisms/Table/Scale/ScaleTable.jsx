import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { Chip } from "@mui/material";

const ScaleTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doDownload,
  doAdd,
  doHelp,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "scale_code",
        header: "Scale Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      {
        accessorKey: "scale_username",
        header: "Scale Username",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 200,
      },
      {
        accessorKey: "scale_password",
        header: "Scale Password",
        Cell: ({ cell }) => "••••••••",
        size: 200,
      },
      // {
      //   accessorKey: "scale_created",
      //   header: "Created At",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "scale_created_by",
      //   header: "Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "scale_updated",
      //   header: "Updated At",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "scale_updated_by",
      //   header: "Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "scale_status",
        header: "Status",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      // {
      //   accessorKey: "scale_status_str",
      //   header: "Status String",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 150,
      // },
    ],
    []
  );
  return (
    <div>
      <DefaultTable
        tableTitle="Scale List"
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

export default ScaleTable;
