import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../../utils/utils/downloadExcel";
import { useStock } from "../../../api/product/query";
import StockTable from "../../../components/UI/organisms/Table/Product/StockTable";
import { useNavigate } from "react-router-dom";

const StockList = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      page: pagination.pageIndex + 1,
    });
    Object.assign(params, {
      limit: pagination.pageSize,
    });

    return params;
  }, [pagination]);

  const queryParams = {
    params: additionalParams,
  };

  const { data: dataStock, isLoading, refetch } = useStock(queryParams);

  // const dataList = useMemo(
  //   () => (dataEventList?.data || []).filter((item) => item.event_status !== 0),
  //   [dataEventList]
  // );

  return (
    <Box sx={{ padding: "16px" }}>
      <StockTable
        rowsItems={dataStock?.data}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataStock?.data, "event")}
        doBack={() => navigate(-1)}
        pagination={pagination}
        setPagination={setPagination}
      />
    </Box>
  );
};

export default StockList;
