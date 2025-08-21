import React, { useMemo, useState } from "react";
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
import { downloadExcel } from "../../utils/utils/downloadExcel";
import WeightModal from "../../components/UI/organisms/Modal/CustomModal/WeightModal";
import {
  useBookingList,
  useBookingReportSummary,
} from "../../api/booking/query";
import BookingTable from "../../components/UI/organisms/Table/Booking/BookingTable";
import { format } from "date-fns";
import { Text } from "../../components/UI/atoms/Typography";
import { formatThousandSeparator } from "../../utils/utils/formatThousandSeparator";
import BookingModal from "../../components/UI/organisms/Modal/CustomModal/Booking";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Booking = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  console.log("Start Date: " + format(startDate, "dd-MM-yyyy"));
  console.log("Start End: " + format(endDate, "dd-MM-yyyy"));

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

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

  const { data: dataBookingSummary } = useBookingReportSummary(queryParams);
  const {
    data: dataBookingList,
    isLoading,
    refetch,
  } = useBookingList(queryParams);

  const dataList = useMemo(
    () =>
      (dataBookingList?.data || []).filter((item) => item.weight_status !== 0),
    [dataBookingList]
  );

  const { data: dataBookingListDownload } = useBookingList({
    params: {
      page: 1,
      limit: 1000,
      datefirst: "",
      datelast: "",
    },
  });

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleModal = async (item) => {
    console.log("item action => ", item);
    switch (item.type) {
      case "add_success":
        refetch();
        closeModal();
        break;
      case "delete_success":
        refetch();
        closeModal();
        break;
      case "cancel":
        closeModal();
        break;

      default:
        break;
    }
  };

  const columns = useMemo(
    () => [
      { key: "total_book", label: "Total Book" },
      { key: "total_duration", label: "Total Duration" },
      { key: "total_income_dirty", label: "Total Income Dirty (IDR)" },
      { key: "total_discount", label: "Total Discount (IDR)" },
      { key: "total_income_clean", label: "Total Income Clean (IDR)" },
    ],
    []
  );

  console.log("dataBookingList?.data => ", dataBookingList?.data);

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
              {dataBookingSummary?.data &&
                dataBookingSummary?.data.map((row, index) => (
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

      <BookingTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataBookingList?.data, "booking")}
        start={startDate}
        doStart={setStartDate}
        end={endDate}
        doEnd={setEndDate}
        doPrint={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("success_booking_receipt");
          setModalData({
            title: "Fishing",
            bookingduration: dataCb.booking_duration,
            price: dataCb.booking_payment_price,
            promo: dataCb.booking_payment_discount,
            total: dataCb.booking_payment_total,
            seatcode: dataCb.seat_code,
            braceletcode: dataCb.bracelet_code,
            bookingpaymentmethod: dataCb.booking_payment_method,
            userphone: dataCb.user_phone,
            userfullname: dataCb.user_fullname,
            bookingStart: dataCb.booking_start,
            bookingCode: dataCb.booking_code,
          });
        }}
        doHelp={() => {
          navigateHelp();
        }}
        doNote={(dataCb) => {
          setModalVisible(true);
          setModalType("booking_note");
          setModalData({
            bookingcode: dataCb.booking_code,
          });
        }}
        pagination={pagination}
        setPagination={setPagination}
      />
      <BookingModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Booking;
