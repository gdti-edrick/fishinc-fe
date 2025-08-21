import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useMemo, useState } from "react";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import {
  useTransactionListAll,
  useTransactionListPoint,
  useTransactionSummaryAll,
  useTransactionSummaryAllItem,
  useTransactionSummaryPoint,
  useTransactionSummaryPointItem,
} from "../../api/transaction/query";
import ListAllTable from "../../components/UI/organisms/Table/Transaction/ListAllTable";
import { format } from "date-fns";
import { Text } from "../../components/UI/atoms/Typography";
import { formatThousandSeparator } from "../../utils/utils/formatThousandSeparator";
import TransactionModal from "../../components/UI/organisms/Modal/CustomModal/Transaction";
import { useNavigate } from "react-router-dom";
import { encryptAES } from "../../utils/utils/encription";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const PointTab = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

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

  const { data: dataTransactionListAll, isLoading } =
    useTransactionListPoint(queryParams);

  const { data: dataTransactionSummaryAll } =
    useTransactionSummaryPoint(queryParams);
  const { data: dataTransactionSummaryAllItem } =
    useTransactionSummaryPointItem(queryParams);

  const columns = useMemo(
    () => [
      { key: "total_transaction", label: "Total Transactions" },
      { key: "total_income", label: "Total Income (IDR)" },
      { key: "total_point_used", label: "Total Points Used" },
    ],
    []
  );

  const handleRowClick = (row) => {
    if (dataTransactionSummaryAllItem.data.length > 0) {
      setModalVisible(true);
      setModalType("detail_summary_table");
      setModalData(dataTransactionSummaryAllItem.data);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleModal = async (item) => {
    console.log("item action => ", item);
  };

  const handleDetail = (detail) => {
    const paramsObj = {
      transactioncode: detail.transactioncode,
    };
    const encryptedParams = encryptAES(JSON.stringify(paramsObj));
    const params = new URLSearchParams({
      ecr: encryptedParams,
    });
    navigate(`/transaction/detail?${params.toString()}`);
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <Box sx={{ backgroundColor: "#fff" }}>
        <Text
          variant="h5"
          sx={{ fontWeight: 600, padding: "40px 40px 10px 40px" }}
        >
          Summary
        </Text>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Text sx={{ fontSize: "14px", fontWeight: 600 }}>
                      {col.label}
                    </Text>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTransactionSummaryAll?.data.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(row)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {row[col.key] !== null
                        ? formatThousandSeparator(row[col.key])
                        : "0"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ListAllTable
        tableTitle="Point List"
        rowsItems={dataTransactionListAll?.data}
        dataCount={10}
        // dataCount={dataAdminList?.data?.count}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() =>
          downloadExcel(dataTransactionListAll?.data, "transaction_list_point")
        }
        start={startDate}
        doStart={setStartDate}
        end={endDate}
        doEnd={setEndDate}
        doDetail={(data) =>
          handleDetail({
            transactioncode: data?.transaction_code,
          })
        }
        doHelp={() => {
          navigateHelp();
        }}
        pagination={pagination}
        setPagination={setPagination}
      />

      <TransactionModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default PointTab;
