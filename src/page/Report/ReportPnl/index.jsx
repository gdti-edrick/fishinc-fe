import { useEffect, useMemo, useState } from "react";
import { Typography, Box, Tooltip, IconButton } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";

import { useReportPnlList } from "../../../api/report/query";
import { CustomDatePicker } from "../../../components/UI/molecules/DatePicker";
import { Text } from "../../../components/UI/atoms/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import { formatThousandSeparator } from "../../../utils/utils/formatThousandSeparator";
import {
  CustomReportTable,
  CustomReportTableForPnl,
} from "../../../components/UI/organisms/Table/CustomTable";

formatThousandSeparator;
const ReportPnl = () => {
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

  const { data: dataReportList, isLoading } = useReportPnlList(queryParams);

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

    setDataOutcomeStockProduct(myOutcomeStockProduct);
  }, [dataReportList?.data?.outcome_stock_product]);

  useEffect(() => {
    const myIncomeMarketProduct = dataReportList?.data?.income_market_product;

    if (!Array.isArray(myIncomeMarketProduct)) return;

    setDataIncomeMarketProduct(myIncomeMarketProduct);
  }, [dataReportList?.data?.income_market_product]);

  const data_outcome_stock = data["outcome_stock"];
  const data_outcome_stock_product = data["outcome_stock_product"];
  const data_income_market = data["income_market"];
  const data_income_market_product = data["income_market_product"];
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
    XLSX.utils.book_append_sheet(wb, ws6, "pnl");

    const fileName = `report_pnl_${format(new Date(), "yyyyMMddHHmmss")}.xlsx`;

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

export default ReportPnl;

const ReporTableNew = ({
  data,
  dataIncomeMarket,
  dataOutcomeStockProduct,
  dataIncomeMarketProduct,
}) => {
  if (!data) return <Typography>No data available</Typography>;

  const [outcomeProductShow, setOutcomeProductShow] = useState(false);
  const [incomeMarketShow, setIncomeMarketShow] = useState(false);

  return (
    <div>
      {/* outcome_stock */}
      <CustomReportTable
        tableData={data["outcome_stock"]}
        title={"Outcome Stock"}
        onClickTable={() => setOutcomeProductShow((prev) => !prev)}
      />

      {/* outcome_stock_product */}
      {outcomeProductShow && (
        <CustomReportTable
          // tableData={data["outcome_stock_product"]}
          tableData={dataOutcomeStockProduct}
          title={"Outcome Stock Product"}
        />
      )}
      {/* income_market */}
      <CustomReportTable
        // tableData={data["income_market"]}
        tableData={dataIncomeMarket}
        title={"Income Market"}
        onClickTable={() => setIncomeMarketShow((prev) => !prev)}
      />
      {/* income_market_product */}
      {incomeMarketShow && (
        <CustomReportTable
          // tableData={data["income_market_product"]}
          tableData={dataIncomeMarketProduct}
          title={"Income Market Product"}
        />
      )}

      {/* pnl */}
      <CustomReportTableForPnl
        tableData={data["pnl"]}
        title={"Profit & Loss (PNL)"}
      />
    </div>
  );
};
