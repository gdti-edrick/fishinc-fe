import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatThousandSeparator } from "../../../../../utils/utils/formatThousandSeparator";
import { useState } from "react";
import { useReportPurchasingVendor } from "../../../../../api/report/query";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

export const CustomReportTable = ({ tableData, title, onClickTable }) => {
  if (!tableData || tableData.length === 0) {
    return (
      <Typography variant="h5" align="center">
        No records to display
      </Typography>
    );
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer
        component={Paper}
        onClick={onClickTable}
        sx={onClickTable && { cursor: "pointer" }}
      >
        <Table
          sx={{
            minWidth: 600, // or width: "100%" if you want full width
            tableLayout: "fixed", // optional: forces all columns to equal width
          }}
        >
          <TableHead>
            <TableRow>
              {Object.keys(tableData[0]).map((column, columnIdx) => (
                <TableCell key={columnIdx}>
                  {column.replace(/_/g, " ").toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => {
              return (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <TableCell key={colIndex}>
                      {formatThousandSeparator(value)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export const CustomReportTableForPnl = ({ tableData, title, onClickTable }) => {
  const newTableData = [
    {
      title: "PNL",
      empty: "",
      data: tableData[0]?.PNL,
    },
  ];
  return (
    <div style={{ marginBottom: "20px" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer
        component={Paper}
        onClick={onClickTable}
        sx={onClickTable && { cursor: "pointer" }}
      >
        <Table
          sx={{
            minWidth: 600, // or width: "100%" if you want full width
            tableLayout: "fixed", // optional: forces all columns to equal width
          }}
        >
          <TableBody>
            {newTableData &&
              newTableData.map((row, rowIndex) => {
                if (newTableData.length > 1) {
                  return (
                    <TableRow key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => {
                        if (
                          value === "NO DATA" ||
                          value === "0" ||
                          value === 0
                        ) {
                          return;
                        }
                        return (
                          <TableCell key={colIndex}>
                            {formatThousandSeparator(value)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                }
                return (
                  <TableRow key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <TableCell key={colIndex}>
                        {formatThousandSeparator(value)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export const CustomReportTableForVendor = ({
  tableData,
  title,
  queryParams,
  onClickTable,
}) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer
        component={Paper}
        onClick={onClickTable}
        sx={onClickTable && { cursor: "pointer" }}
      >
        <Table
          sx={{
            minWidth: 600, // or width: "100%" if you want full width
            tableLayout: "fixed", // optional: forces all columns to equal width
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "50px", padding: "0 8px" }}></TableCell>
              {Object.keys(tableData[0]).map((column, columnIdx) => (
                <TableCell key={columnIdx}>
                  {column.replace(/_/g, " ").toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => {
              return (
                <VendorTableRow
                  row={row}
                  rowIndex={rowIndex}
                  queryParams={queryParams}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const VendorTableRow = ({ row, rowIndex, queryParams }) => {
  console.log("row => ", row.vendor_code);
  const [isShow, setIsShow] = useState(false);
  const rowData = Object.values(row);

  const { data: dataVendor, isLoading } = useReportPurchasingVendor({
    params: {
      datefirst: queryParams.params.datefirst,
      datelast: queryParams.params.datelast,
      vendorcode: row.vendor_code,
    },
  });

  return (
    <>
      <TableRow key={rowIndex}>
        <TableCell>
          {row.vendor_code !== "NO DATA" && (
            <IconButton size="small" onClick={() => setIsShow(!isShow)}>
              {isShow ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </TableCell>
        {rowData.map((value, colIndex) => (
          <TableCell key={colIndex}>{formatThousandSeparator(value)}</TableCell>
        ))}
      </TableRow>

      <TableRow>
        <TableCell
          colSpan={rowData.length + 1}
          style={{ paddingBottom: 0, paddingTop: 0 }}
        >
          <Collapse in={isShow} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <CustomReportTable tableData={dataVendor?.data} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
