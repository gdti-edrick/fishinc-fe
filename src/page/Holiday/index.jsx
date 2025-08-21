import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import { navigateHelp } from "../../utils/utils/navigateHelp";
import HolidayTable from "../../components/UI/organisms/Table/Holiday/HolidayTable";
import { useHolidayList } from "../../api/holiday/query";
import HolidayModal from "../../components/UI/organisms/Modal/CustomModal/HolidayModal";
import { convertIsoToDateOnly } from "../../utils/utils/formatString";

const Holiday = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

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

    return params;
  }, [pagination]);

  const queryParams = {
    params: additionalParams,
  };

  const {
    data: dataUserList,
    isLoading,
    refetch,
  } = useHolidayList(queryParams);

  const dataList = useMemo(() => dataUserList?.data || [], [dataUserList]);
  // const dataList = useMemo(
  //   () => (dataUserList?.data || []).filter((item) => item.user_status !== 0),
  //   [dataUserList]
  // );

  // const { data: dataSeatListDownload } = useUserList({
  //   params: {
  //     page: 1,
  //     limit: 1000,
  //   },
  // });

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

  return (
    <Box sx={{ padding: "16px" }}>
      <HolidayTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataList, "user")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_holiday");
          setModalData({
            holidaydate: "",
            holidayname: "",
            holidaynote: "",
            type: "add",
          });
        }}
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_holiday");
          setModalData({
            holidayindex: dataCb.holiday_index,
            holidaydate: convertIsoToDateOnly(dataCb.holiday_date),
            holidayname: dataCb.holiday_name,
            holidaynote: dataCb.holiday_note,
            type: "update",
          });
        }}
        doDelete={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("confirmation");
          setModalData(dataCb);
        }}
        // doHelp={() => {
        //   navigateHelp();
        // }}
        pagination={pagination}
        setPagination={setPagination}
      />
      <HolidayModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Holiday;
