import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";

import WeightModal from "../../components/UI/organisms/Modal/CustomModal/WeightModal";
import { useBookingList } from "../../api/booking/query";
import { useReportList } from "../../api/report/query";
import { CustomDatePicker } from "../../components/UI/molecules/DatePicker";
import { Text } from "../../components/UI/atoms/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import { formatThousandSeparator } from "../../utils/utils/formatThousandSeparator";

formatThousandSeparator;
const ReportSummary = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const initialStartDate = new Date();
  initialStartDate.setDate(initialStartDate.getDate() - 30);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(tomorrow);

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      page: pagination.pageIndex + 1,
    });
    Object.assign(params, {
      limit: pagination.pageSize,
    });
    Object.assign(params, {
      datefirst: format(startDate, "dd-MM-yyyy"),
    });
    Object.assign(params, {
      datelast: format(endDate, "dd-MM-yyyy"),
    });

    return params;
  }, [pagination, startDate, endDate]);

  const queryParams = {
    params: additionalParams,
  };

  const [dataOutcomeStockProduct, setDataOutcomeStockProduct] = useState([]);
  const [dataIncomeMarketProduct, setDataIncomeMarketProduct] = useState([]);
  const [dataIncomeMarket, setDataIncomeMarket] = useState([
    {
      transaction_method: "CASH",
      total_transaction: 0,
      total_qty_sold: "0",
      total_income_market: "0",
    },
    {
      transaction_method: "CREDIT",
      total_transaction: 0,
      total_qty_sold: "0",
      total_income_market: "0",
    },
    {
      transaction_method: "DEBIT",
      total_transaction: 0,
      total_qty_sold: "0",
      total_income_market: "0",
    },
    {
      transaction_method: "QRIS",
      total_transaction: 0,
      total_qty_sold: "0",
      total_income_market: "0",
    },
    {
      transaction_method: "TOTAL",
      total_transaction: 0,
      total_qty_sold: "0",
      total_income_market: "0",
    },
  ]);

  const { data: dataReportList, isLoading } = useReportList(queryParams);

  const data = useMemo(() => dataReportList?.data || {}, [dataReportList]);

  useEffect(() => {
    const myDataIncomeMarket = dataReportList?.data?.income_market;

    if (!Array.isArray(myDataIncomeMarket)) return;

    const updated = dataIncomeMarket.map((defaultItem) => {
      const found = myDataIncomeMarket.find(
        (item) => item.transaction_method === defaultItem.transaction_method
      );
      return found ?? defaultItem;
    });

    setDataIncomeMarket(updated);
  }, [dataReportList?.data?.income_market]);

  useEffect(() => {
    const myOutcomeStockProduct = dataReportList?.data?.outcome_stock_product;

    if (!Array.isArray(myOutcomeStockProduct)) return;

    const cleanedStock = myOutcomeStockProduct.filter(
      (item) => !Object.values(item).includes("NO DATA")
    );

    setDataOutcomeStockProduct(cleanedStock);
  }, [dataReportList?.data?.outcome_stock_product]);

  useEffect(() => {
    const myIncomeMarketProduct = dataReportList?.data?.income_market_product;

    if (!Array.isArray(myIncomeMarketProduct)) return;

    const cleanedStock = myIncomeMarketProduct.filter(
      (item) => !Object.values(item).includes("NO DATA")
    );

    console.log("cleanedStock", cleanedStock);
    setDataIncomeMarketProduct(cleanedStock);
  }, [dataReportList?.data?.income_market_product]);

  const data_outcome_stock = data["outcome_stock"];
  const data_outcome_stock_product =
    data["outcome_stock_product"]?.length > 1
      ? data["outcome_stock_product"].slice(0, -1)
      : data["outcome_stock_product"] || [];
  const data_income_market = data["income_market"];
  const data_income_market_product =
    data["income_market_product"]?.length > 1
      ? data["income_market_product"].slice(0, -1)
      : data["income_market_product"] || [];
  const data_income_booking = data["income_booking"];
  const data_pnl = data["pnl"];

  const doDownload = () => {
    if (!data) return;

    const wsData1 = [["No", ...Object.keys(data_outcome_stock[0])]];
    data_outcome_stock.forEach((item, index) => {
      wsData1.push([`${index + 1}`, ...Object.values(item)]);
    });
    const ws1 = XLSX.utils.aoa_to_sheet(wsData1);

    const wsData2 = [["No", ...Object.keys(data_outcome_stock_product[0])]];
    data_outcome_stock_product.forEach((item, index) => {
      wsData2.push([`${index + 1}`, ...Object.values(item)]);
    });
    const ws2 = XLSX.utils.aoa_to_sheet(wsData2);

    const wsData3 = [["No", ...Object.keys(data_income_market[0])]];
    data_income_market.forEach((item, index) => {
      wsData3.push([`${index + 1}`, ...Object.values(item)]);
    });
    const ws3 = XLSX.utils.aoa_to_sheet(wsData3);

    const wsData4 = [["No", ...Object.keys(data_income_market_product[0])]];
    data_income_market_product.forEach((item, index) => {
      wsData4.push([`${index + 1}`, ...Object.values(item)]);
    });
    const ws4 = XLSX.utils.aoa_to_sheet(wsData4);

    const wsData5 = [["No", ...Object.keys(data_income_booking[0])]];
    data_income_booking.forEach((item, index) => {
      wsData5.push([`${index + 1}`, ...Object.values(item)]);
    });
    const ws5 = XLSX.utils.aoa_to_sheet(wsData5);

    const wsData6 = [["No", ...Object.keys(data_pnl[0])]];
    data_pnl.forEach((item, index) => {
      wsData6.push([`${index + 1}`, ...Object.values(item)]);
    });
    const ws6 = XLSX.utils.aoa_to_sheet(wsData6);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws1, "outcome_stock");
    XLSX.utils.book_append_sheet(wb, ws2, "outcome_stock_product");
    XLSX.utils.book_append_sheet(wb, ws3, "income_market");
    XLSX.utils.book_append_sheet(wb, ws4, "income_market_product");
    XLSX.utils.book_append_sheet(wb, ws5, "income_booking");
    XLSX.utils.book_append_sheet(wb, ws6, "pnl");

    const fileName = `report_${format(new Date(), "yyyyMMddHHmmss")}.xlsx`;

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);
  };

  return (
    <Box
      sx={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          gap: "0.5rem",
        }}
      >
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
            selectedDate={startDate}
            setSelectedDate={setStartDate}
            tooltipTitle="Date First"
          />
        </Box>

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
            selectedDate={endDate}
            setSelectedDate={setEndDate}
            tooltipTitle="Date Last"
          />
        </Box>

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
      </Box>

      {/* Report Tables */}
      {!isLoading && data ? (
        <ReporTableNew
          data={data}
          dataIncomeMarket={dataIncomeMarket}
          dataOutcomeStockProduct={dataOutcomeStockProduct}
          dataIncomeMarketProduct={dataIncomeMarketProduct}
        />
      ) : (
        // <ReporTable data={data} />
        <Typography align="center">No data available</Typography>
      )}
    </Box>
  );
};

export default ReportSummary;

const ReporTableNew = ({
  data,
  dataIncomeMarket,
  dataOutcomeStockProduct,
  dataIncomeMarketProduct,
}) => {
  if (!data) return <Typography>No data available</Typography>;

  const [outcomeProductShow, setOutcomeProductShow] = useState(false);
  const [incomeMarketShow, setIncomeMarketShow] = useState(false);

  // Define table titles
  const tables = [
    { key: "outcome_stock", title: "Outcome Stock" },
    { key: "outcome_stock_product", title: "Outcome Stock Product" },
    { key: "income_market", title: "Income Market" },
    { key: "income_market_product", title: "Income Market Product" },
    { key: "income_booking", title: "Income Booking" },
    { key: "pnl", title: "Profit & Loss (PNL)" },
  ];

  console.log("data table => ", data);
  console.log("data outcome_stock => ", data["outcome_stock"]);

  return (
    <div>
      {/* outcome_stock */}
      <CustomTable
        tableData={data["outcome_stock"]}
        title={"Outcome Stock"}
        onClickTable={() => setOutcomeProductShow((prev) => !prev)}
      />

      {/* outcome_stock_product */}
      {outcomeProductShow && (
        <CustomTable
          // tableData={data["outcome_stock_product"]}
          tableData={dataOutcomeStockProduct}
          title={"Outcome Stock Product"}
        />
      )}
      {/* income_market */}
      <CustomTable
        // tableData={data["income_market"]}
        tableData={dataIncomeMarket}
        title={"Income Market"}
        onClickTable={() => setIncomeMarketShow((prev) => !prev)}
      />
      {/* income_market_product */}
      {incomeMarketShow && (
        <CustomTable
          // tableData={data["income_market_product"]}
          tableData={dataIncomeMarketProduct}
          title={"Income Market Product"}
        />
      )}
      {/* income_booking */}
      <CustomTable
        tableData={data["income_booking"]}
        title={"Income Booking"}
      />
      {/* pnl */}
      <CustomTableForPnl
        tableData={data["pnl"]}
        title={"Profit & Loss (PNL)"}
      />
    </div>
  );
};

const CustomTable = ({ tableData, title, onClickTable }) => {
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
              {Object.keys(tableData[0]).map((column) => (
                <TableCell key={column}>
                  {column.replace(/_/g, " ").toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => {
              if (tableData.length > 1) {
                return (
                  <TableRow key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => {
                      //  if (value === "NO DATA" || value === "0" || value === 0) {
                      //       return;
                      //     }
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

const CustomTableForPnl = ({ tableData, title, onClickTable }) => {
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
