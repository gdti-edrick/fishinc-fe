//MRT Imports
import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  useMaterialReactTable,
} from "material-react-table";

//Material UI Imports
import { Box, Button, IconButton, lighten, Menu, Tooltip } from "@mui/material";

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import useAppContext from "../../../../../hooks/useAppContext";
import { Text } from "../../../atoms/Typography";
import { useEffect, useMemo, useState } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CustomDatePicker } from "../../../molecules/DatePicker";
import { SearchBar } from "../../../atoms/BasicInput";
import { set } from "lodash";

const Example = ({
  tableTitle,
  columns,
  data,
  dataCount,
  isLoadingTable,
  doDownload,
  doAdd,
  start,
  doStart,
  end,
  doEnd,
  doRefresh,
  doBack,
  doHelp,
  pagination,
  setPagination,
  search,
  setSearch,
}) => {
  const tableData = useMemo(() => data, [data, pagination]);

  const existingData = JSON.parse(localStorage.getItem("table")) || {};
  const tableSettings = existingData[tableTitle] || {};

  const columnVisibilityRaw = columns.reduce((acc, col) => {
    acc[col.accessorKey] = true;
    return acc;
  }, {});

  // Transform into an array
  const columnOrderRaw = columns.map((col) => col.accessorKey);

  const [columnVisibility, setColumnVisibility] = useState(() => {
    return tableSettings.columnVisibility || columnVisibilityRaw;
  });

  const [columnOrder, setColumnOrder] = useState(() => {
    return tableSettings.columnOrder || columnOrderRaw;
  });

  const sortArrayAscending = (arr) => {
    return [...arr].sort();
  };

  const handlePaginationChange = (newPagination) => {
    setPagination(newPagination);
  };

  useEffect(() => {
    const newColumnOrder = columns.map((col) => col.accessorKey);
    const existColumnOrder = tableSettings.columnOrder || columnOrderRaw;
    const sortedFields1 = sortArrayAscending(newColumnOrder);
    const sortedFields2 = sortArrayAscending(existColumnOrder);

    if (sortedFields1.join() !== sortedFields2.join()) {
      setColumnOrder(columnOrderRaw);
      setColumnVisibility(columnVisibilityRaw);
    }
  }, []);

  // // Save column visibility to localStorage when it changes
  useEffect(() => {
    const updatedData = {
      ...existingData,
      [tableTitle]: {
        columnVisibility,
        columnOrder,
      },
    };
    localStorage.setItem("table", JSON.stringify(updatedData));
  }, [columnVisibility, columnOrder]);

  const table = useMaterialReactTable({
    enableColumnOrdering: true,
    // enableRowSelection: false,
    // enableGrouping: true,
    columns,
    data: tableData,
    // data: paginatedData,
    enableColumnFilterModes: true,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableFacetedValues: true,
    autoResetPageIndex: false,
    onPaginationChange: handlePaginationChange,
    manualPagination: true, // pagination is handled in FE
    // rowCount: data.length, // total rows
    rowCount: 10000, // total rows
    state: {
      columnVisibility,
      columnOrder,
      // pagination, // ✅ Gunakan state dari useState
      pagination: {
        pageIndex: pagination?.pageIndex || 0, // Start at first page
        pageSize: pagination?.pageSize || 25,
      },
      isLoading: isLoadingTable,
    },
    onColumnOrderChange: (newOrder) => {
      setColumnOrder(newOrder);
      // const tempLocal = {
      //   columnVisibility,
      //   columnOrder: newOrder,
      // };
      // localStorage.setItem(table, JSON.stringify(tempLocal));

      const updatedData = {
        ...existingData,
        [tableTitle]: {
          columnVisibility,
          columnOrder: newOrder,
        },
      };
      localStorage.setItem("table", JSON.stringify(updatedData));
    },
    onColumnVisibilityChange: (newVisibility) => {
      // setColumnVisibility(newVisibility);
      // const tempLocal = {
      //   columnVisibility: newVisibility,
      //   columnOrder,
      // };
      // localStorage.setItem(tableTitle, JSON.stringify(tempLocal));

      setColumnVisibility(newVisibility);
      const updatedData = {
        ...existingData,
        [tableTitle]: {
          columnVisibility: newVisibility,
          columnOrder,
        },
      };
      localStorage.setItem("table", JSON.stringify(updatedData));
    },

    // rowCount: Number(dataCount),
    initialState: {
      // columnVisibility: {
      //   bracelet_status_str: true,
      //   bracelet_code: false,
      //   bracelet_status: true,
      // },
      showColumnFilters: false,
      showGlobalFilter: true,
      columnPinning: {
        // right: ["actions"],
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "primary",
      shape: "rounded",
      showRowsPerPage: true,
      rowsPerPageOptions: [5, 25, 50, 100, 250, 500, 1000],
      variant: "outlined",
    },
    // muiPaginationProps: {
    //   color: "secondary",
    //   rowsPerPageOptions: [10, 20, 30, 50],
    //   shape: "rounded",
    //   variant: "outlined",
    // },
    muiTablePaperProps: {
      elevation: 0, //change the mui box shadow
      //customize paper styles
      sx: {
        borderRadius: "0",
        border: "none",
        padding: "24px 0px",

        "& tr > td": {
          borderBottom: "none",
        },
        "& tr:nth-of-type(odd) > td": {
          backgroundColor: "#f5f5f5",
        },
      },
    },
    renderTopToolbar: ({ table }) => {
      return (
        <HeaderTable
          tableTitle={tableTitle}
          table={table}
          doDownload={doDownload}
          doAdd={doAdd}
          start={start}
          doStart={doStart}
          end={end}
          doEnd={doEnd}
          doRefresh={doRefresh}
          doBack={doBack}
          doHelp={doHelp}
          search={search}
          setSearch={setSearch}
        />
      );
    },
  });

  return <MaterialReactTable table={table} sx={{ borderRadius: "100px" }} />;
};

const HeaderTable = ({
  tableTitle,
  table,
  doAdd,
  doDownload,
  start,
  doStart,
  end,
  doEnd,
  doRefresh,
  doBack,
  doHelp,
  search,
  setSearch,
}) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: lighten(theme.palette.background.default, 0.05),
        display: "flex",
        gap: "0.5rem",
        p: "40px",
        justifyContent: "space-between",
      })}
    >
      <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {doBack && (
          <Tooltip title="Back">
            <IconButton
              onClick={doBack}
              sx={{
                borderRadius: "50%",
                padding: "8px",
                color: "#707070",
              }}
              aria-label="download excel"
            >
              <ArrowBackIcon sx={{ width: "24px", height: "24px" }} />
            </IconButton>
          </Tooltip>
        )}
        <Text variant="h5" sx={{ fontWeight: 600 }}>
          {tableTitle}
        </Text>
      </Box>
      <Box>
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          {doStart && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Text>Start: </Text>
              <CustomDatePicker
                selectedDate={start}
                setSelectedDate={doStart}
                tooltipTitle="Date First"
              />
            </Box>
          )}
          {doEnd && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Text>End: </Text>
              <CustomDatePicker
                selectedDate={end}
                setSelectedDate={doEnd}
                tooltipTitle="Date Last"
              />
            </Box>
          )}
          {search !== undefined ? (
            <SearchBar search={search} setSearch={setSearch} />
          ) : (
            <MRT_GlobalFilterTextField table={table} />
          )}
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
          {doDownload && (
            <Tooltip title="Download Excel">
              <IconButton
                onClick={doDownload}
                sx={{
                  borderRadius: "50%",
                  padding: "8px",
                  color: "#707070",
                }}
                aria-label="download excel"
              >
                <DownloadIcon sx={{ width: "24px", height: "24px" }} />
              </IconButton>
            </Tooltip>
          )}
          {doRefresh && (
            <Tooltip title="Refresh">
              <IconButton
                onClick={doRefresh}
                sx={{
                  borderRadius: "50%",
                  padding: "8px",
                  color: "#707070",
                }}
                aria-label="refresh"
              >
                <RefreshIcon sx={{ width: "24px", height: "24px" }} />
              </IconButton>
            </Tooltip>
          )}
          {doAdd && (
            <Tooltip title="Add">
              <IconButton
                onClick={doAdd}
                sx={{
                  borderRadius: "50%",
                  padding: "8px",
                  color: "#707070",
                }}
                aria-label="download excel"
              >
                <AddIcon sx={{ width: "24px", height: "24px" }} />
              </IconButton>
            </Tooltip>
          )}
          {doHelp && (
            <Tooltip title="Help">
              <IconButton
                onClick={doHelp}
                sx={{
                  borderRadius: "50%",
                  padding: "8px",
                  color: "#707070",
                }}
                aria-label="Help"
              >
                <QuestionMarkIcon sx={{ width: "24px", height: "24px" }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const DefaultTable = ({
  tableTitle,
  columns,
  data,
  dataCount,
  isLoadingTable = false,
  doDownload,
  doAdd,
  start,
  doStart,
  end,
  doEnd,
  doRefresh,
  doBack,
  doHelp,
  pagination,
  setPagination,
  search,
  setSearch,
}) => (
  //App.tsx or AppProviders file
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example
      tableTitle={tableTitle}
      columns={columns}
      data={data}
      dataCount={dataCount}
      isLoadingTable={isLoadingTable}
      doDownload={doDownload}
      doAdd={doAdd}
      start={start}
      doStart={doStart}
      end={end}
      doEnd={doEnd}
      doRefresh={doRefresh}
      doBack={doBack}
      doHelp={doHelp}
      pagination={pagination}
      setPagination={setPagination}
      search={search}
      setSearch={setSearch}
    />
  </LocalizationProvider>
);

export default DefaultTable;
