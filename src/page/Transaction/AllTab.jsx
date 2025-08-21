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
  useTransactionSummaryAll,
  useTransactionSummaryAllItem,
} from "../../api/transaction/query";
import ListAllTable from "../../components/UI/organisms/Table/Transaction/ListAllTable";
import { format } from "date-fns";
import { Text } from "../../components/UI/atoms/Typography";
import { formatThousandSeparator } from "../../utils/utils/formatThousandSeparator";
import TransactionModal from "../../components/UI/organisms/Modal/CustomModal/Transaction";
import { encryptAES } from "../../utils/utils/encription";
import { useNavigate } from "react-router-dom";
import { useTransactionDetailPrint } from "../../api/transaction/mutation";
import { navigateHelp } from "../../utils/utils/navigateHelp";
import { formatInTimeZone } from "date-fns-tz";

const AllTab = () => {
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
    useTransactionListAll(queryParams);

  const { data: dataTransactionSummaryAll } =
    useTransactionSummaryAll(queryParams);
  const { data: dataTransactionSummaryAllItem } =
    useTransactionSummaryAllItem(queryParams);

  const columns = useMemo(
    () => [
      { key: "total_transaction", label: "Total Transactions" },
      { key: "total_income", label: "Total Income (IDR)" },
      { key: "total_point_used", label: "Total Points Used" },
    ],
    []
  );

  // console.log(
  //   "test date => ",
  //   formatInTimeZone(new Date(), "Asia/Jakarta", "dd MMMM yyyy HH:mm:ss")
  // );

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
    switch (item.type) {
      case "cancel":
        closeModal();
        break;

      default:
        break;
    }
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

  const TransactionDetailPrint = useTransactionDetailPrint();
  const handlePrint = (detail) => {
    const dataCreate = {
      params: {
        transactioncode: detail?.transaction_code,
      },
    };

    console.log("detail => ", detail);

    TransactionDetailPrint.mutate(dataCreate, {
      onSuccess: (response) => {
        console.log("TransactionDetailPrint => ", response);
        if (response.status.status === 1) {
          console.log("response => ", response);

          const tempData = response.data;

          const remappedArray = tempData.map((item) => ({
            productcode: item.product_code,
            productname: item.product_name,
            productpriceidr: `${item.product_price_idr}`,
            // productpricepoint: item.productpricepoint,
            itemqty: `${item.transaction_item_qty}`,
            itemtotalidr: `${
              item.product_price_idr * item.transaction_item_qty
            }`, // Calculate total price
            // itemtotalpoint: item.itemtotalpoint,
          }));

          const dataPrint = {
            transactioncode: detail.transaction_code,
            transactionmethod: detail.transaction_method,
            transactionidr: detail.transaction_idr,
            transactionpoint: detail.transaction_point,
            transactioncreated: detail.transaction_created,
            items: remappedArray,
          };

          console.log("dataPrint => ", dataPrint);

          setModalVisible(true);
          setModalType("market_success");
          setModalData(dataPrint);
        } else {
          setErrorMessage(response.status.message[0].errormessage);
        }
      },
    });
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
        tableTitle="All List"
        rowsItems={dataTransactionListAll?.data}
        dataCount={10}
        // dataCount={dataAdminList?.data?.count}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() =>
          downloadExcel(dataTransactionListAll?.data, "transaction_list_all")
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
        doPrint={(dataCb) => {
          handlePrint(dataCb);
        }}
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

export default AllTab;
