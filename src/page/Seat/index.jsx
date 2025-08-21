import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import { useSeatList } from "../../api/seat/query";
import SeatTable from "../../components/UI/organisms/Table/Seat/SeatTable";
import SeatModal from "../../components/UI/organisms/Modal/CustomModal/SeatModal/Index";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Seat = () => {
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

  const { data: dataSeatList, isLoading } = useSeatList(queryParams);
  const { data: dataSeatListDownload } = useSeatList({
    params: {
      page: 1,
      limit: 1000,
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

  return (
    <Box sx={{ padding: "16px" }}>
      <SeatTable
        rowsItems={dataSeatList?.data}
        dataCount={10}
        // dataCount={dataAdminList?.data?.count}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataSeatListDownload?.data, "seat")}
        doDelete={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("confirmation");
          setModalData(dataCb);
        }}
        doHelp={() => {
          navigateHelp();
        }}
        pagination={pagination}
        setPagination={setPagination}
      />
      <SeatModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Seat;
