import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";

const BraceletTable = ({
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
        accessorKey: "bracelet_code",
        header: "Bracelet Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
      // {
      //   accessorKey: "bracelet_created",
      //   header: "Bracelet Created",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "bracelet_created_by",
      //   header: "Bracelet Created By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "bracelet_updated",
      //   header: "Bracelet Updated",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      // {
      //   accessorKey: "bracelet_updated_by",
      //   header: "Bracelet Updated By",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "bracelet_status",
        header: "Bracelet Status",
        Cell: ({ cell }) => cell.getValue(),
        size: 150,
      },
      {
        accessorKey: "bracelet_status_str",
        header: "Bracelet Status Str",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 150,
      },
    ],
    []
  );
  return (
    <div>
      <DefaultTable
        tableTitle="Bracelet List"
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

export default BraceletTable;
