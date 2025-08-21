import React, { useMemo } from "react";
import DefaultTable from "../DefaultTable";
import { IconButton } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const PointDetailTable = ({
  rowsItems = [],
  dataCount,
  isLoadingTable,
  cbEdit,
  cbInfo,
  doDownload,
  doAdd,
  // doEdit,
  // doDelete,
  doDetail,
}) => {
  const columns = useMemo(
    () => [
      // {
      //   accessorKey: "point_code",
      //   header: "Point Code",
      //   Cell: ({ cell }) => cell.getValue() || "-",
      //   size: 200,
      // },
      {
        accessorKey: "weight_number",
        header: "Weight",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 80,
      },
      {
        accessorKey: "point_total_before",
        header: "Total Points Before",
        Cell: ({ cell }) => cell.getValue() || "0",
        size: 100,
      },
      {
        accessorKey: "point_sum",
        header: "Point Sum",
        Cell: ({ cell }) => cell.getValue() || "0",
        size: 100,
      },
      {
        accessorKey: "point_total_after",
        header: "Total Points After",
        Cell: ({ cell }) => cell.getValue() || "0",
        size: 100,
      },
      {
        accessorKey: "event_code",
        header: "Event Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "game_code",
        header: "Game Code",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      {
        accessorKey: "point_ref",
        header: "Point Reference",
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 100,
      },
      // {
      //   accessorKey: "point_created",
      //   header: "Created At",
      //   Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString() || "-",
      //   size: 200,
      // },
    ],
    []
  );
  return (
    <div>
      <DefaultTable
        tableTitle="Point Detail"
        columns={columns}
        data={rowsItems}
        dataCount={dataCount}
        isLoadingTable={isLoadingTable}
        doDownload={doDownload}
        doAdd={doAdd}
      />
    </div>
  );
};

export default PointDetailTable;
