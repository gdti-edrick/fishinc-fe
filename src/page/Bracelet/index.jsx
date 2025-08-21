import { Box } from "@mui/material";
import BraceletTable from "../../components/UI/organisms/Table/Bracelet/BraceletTable";
import { useBraceletList } from "../../api/bracelet/query";
import { useMemo, useState } from "react";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import BraceletModal from "../../components/UI/organisms/Modal/CustomModal/BraceletModal";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Bracelet = () => {
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
    data: dataBraceletList,
    isLoading,
    refetch,
  } = useBraceletList(queryParams);
  const { data: dataBraceletListDownload } = useBraceletList({
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
      <BraceletTable
        rowsItems={dataBraceletList?.data}
        dataCount={10}
        // dataCount={dataAdminList?.data?.count}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() =>
          downloadExcel(dataBraceletListDownload?.data, "bracelet")
        }
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_bracelet");
          setModalData({
            braceletcode: "",
            type: "add",
          });
        }}
        doHelp={() => {
          navigateHelp();
        }}
        pagination={pagination}
        setPagination={setPagination}
      />
      <BraceletModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Bracelet;
