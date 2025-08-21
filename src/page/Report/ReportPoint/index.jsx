import { useEffect, useMemo, useState } from "react";
import { Typography, Box, Tooltip, IconButton, Tabs, Tab } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";

import { useReportPointList } from "../../../api/report/query";
import { CustomDatePicker } from "../../../components/UI/molecules/DatePicker";
import { Text } from "../../../components/UI/atoms/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import { formatThousandSeparator } from "../../../utils/utils/formatThousandSeparator";
import { CustomReportTable } from "../../../components/UI/organisms/Table/CustomTable";

formatThousandSeparator;
const ReportPoint = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const initialStartDate = new Date();
  initialStartDate.setDate(initialStartDate.getDate() - 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 0);

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

  const defaultTransaction = [
    {
      transaction_method: "POINT",
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
  ];
  const defaultTransactionBooking = [
    {
      booking_payment_method: "CASH",
      total_book: 0,
      total_duration: "0",
      total_income_booking: "0",
    },
    {
      booking_payment_method: "CREDIT",
      total_book: 0,
      total_duration: "0",
      total_income_booking: "0",
    },
    {
      booking_payment_method: "DEBIT",
      total_book: 0,
      total_duration: "0",
      total_income_booking: "0",
    },
    {
      booking_payment_method: "QRIS",
      total_book: 0,
      total_duration: "0",
      total_income_booking: "0",
    },
    {
      booking_payment_method: "TOTAL",
      total_book: 0,
      total_duration: "0",
      total_income_booking: "0",
    },
  ];
  const [dataIncomeMarket, setDataIncomeMarket] = useState(defaultTransaction);
  const [dataIncomeBooking, setDataIncomeBooking] = useState(
    defaultTransactionBooking
  );

  const { data: dataReportList, isLoading } = useReportPointList(queryParams);

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
    const myDataIncomeBooking = dataReportList?.data?.income_booking;

    if (!Array.isArray(myDataIncomeBooking)) return;

    const updated = dataIncomeBooking.map((defaultItem) => {
      const found = myDataIncomeBooking.find(
        (item) =>
          item.booking_payment_method === defaultItem.booking_payment_method
      );
      return found ?? defaultItem;
    });

    setDataIncomeBooking(updated);
  }, [dataReportList?.data?.income_booking]);

  useEffect(() => {
    const myOutcomeStockProduct = dataReportList?.data?.outcome_stock_product;

    if (!Array.isArray(myOutcomeStockProduct)) return;

    // const cleanedStock = myOutcomeStockProduct.filter(
    //   (item) => !Object.values(item).includes("NO DATA")
    // );

    setDataOutcomeStockProduct(myOutcomeStockProduct);
  }, [dataReportList?.data?.outcome_stock_product]);

  useEffect(() => {
    const myIncomeMarketProduct = dataReportList?.data?.income_market_product;

    if (!Array.isArray(myIncomeMarketProduct)) return;

    // const cleanedStock = myIncomeMarketProduct.filter(
    //   (item) => !Object.values(item).includes("NO DATA")
    // );

    console.log("cleanedStock", myIncomeMarketProduct);
    setDataIncomeMarketProduct(myIncomeMarketProduct);
  }, [dataReportList?.data?.income_market_product]);

  const data_report_point = useMemo(() => data["report_point"] || [], [data]);
  const data_report_point_get = useMemo(
    () => data["report_point_get"] || [],
    [data]
  );
  const data_report_point_spend = useMemo(
    () => data["report_point_spend"] || [],
    [data]
  );

  const doDownload = () => {
    if (!data) return;

    const wsData1 = [["No", ...Object.keys(data_report_point[0])]];
    data_report_point.forEach((item, index) => {
      wsData1.push([`${index + 1}`, ...Object.values(item)]);
    });
    const ws1 = XLSX.utils.aoa_to_sheet(wsData1);

    const wsData2 = [["No", ...Object.keys(data_report_point_get[0])]];
    data_report_point_get.forEach((item, index) => {
      wsData2.push([`${index + 1}`, ...Object.values(item)]);
    });
    const ws2 = XLSX.utils.aoa_to_sheet(wsData2);

    const wsData3 = [["No", ...Object.keys(data_report_point_spend[0])]];
    data_report_point_spend.forEach((item, index) => {
      wsData3.push([`${index + 1}`, ...Object.values(item)]);
    });
    const ws3 = XLSX.utils.aoa_to_sheet(wsData3);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws1, "report_point");
    XLSX.utils.book_append_sheet(wb, ws2, "report_point_get");
    XLSX.utils.book_append_sheet(wb, ws3, "report_point_spend");

    const fileName = `report_point_${format(
      new Date(),
      "yyyyMMddHHmmss"
    )}.xlsx`;

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
          dataReportPoint={data_report_point}
          dataReportPointGet={data_report_point_get}
          dataReportPointSpend={data_report_point_spend}
        />
      ) : (
        // <ReporTable data={data} />
        <Typography align="center">No data available</Typography>
      )}
    </Box>
  );
};

export default ReportPoint;

const ReporTableNew = ({
  data,
  dataReportPoint,
  dataReportPointGet,
  dataReportPointSpend,
}) => {
  if (!data) return <Typography>No data available</Typography>;
  console.log("data table => ", data);

  const [tabValue, setTabValue] = useState("point");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTab = () => {
    switch (tabValue) {
      case "point":
        return (
          <CustomReportTable
            tableData={dataReportPoint}
            title={"Report Point"}
          />
        );
      case "get":
        return (
          <CustomReportTable
            tableData={dataReportPointGet}
            title={"Report Point Get"}
          />
        );
      case "spend":
        return (
          <CustomReportTable
            tableData={dataReportPointSpend}
            title={"Report Point Spend"}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{}}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          padding: "16px",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
          centered
          sx={{
            ".Mui-selected": {
              color: `#000000`,
              fontWeight: 900,
            },
          }}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#FFCB10",
            },
          }}
        >
          <Tab
            value="point"
            label="Report Point"
            sx={{
              fontSize: { xs: "9px", sm: "10px", md: "12px" },
              fontWeight: 700,
              textTransform: "none",
              "&.Mui-selected": {
                color: "#000000",
              },
            }}
          />
          <Tab
            value="get"
            label="Report Point Get"
            sx={{
              fontSize: { xs: "9px", sm: "10px", md: "12px" },
              fontWeight: 700,
              textTransform: "none",
              "&.Mui-selected": {
                color: "#000000",
              },
            }}
          />
          <Tab
            value="spend"
            label="Report Point Spend"
            sx={{
              fontSize: { xs: "9px", sm: "10px", md: "12px" },
              fontWeight: 700,
              textTransform: "none",
              "&.Mui-selected": {
                color: "#000000",
              },
            }}
          />
        </Tabs>
      </Box>

      {renderTab()}
    </Box>
  );
};
