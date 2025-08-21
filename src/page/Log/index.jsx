import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useUserList } from "../../api/user/query";
import LogsTable from "../../components/UI/organisms/Table/Logs/LogsTable";
import { useLogList } from "../../api/log/query";

const LogList = () => {
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

  const { data: dataUserList, isLoading, refetch } = useLogList(queryParams);

  const dataList = useMemo(() => dataUserList?.data || [], [dataUserList]);

  return (
    <Box sx={{ padding: "16px" }}>
      <LogsTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        pagination={pagination}
        setPagination={setPagination}
      />
    </Box>
  );
};

export default LogList;
