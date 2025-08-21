import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import { navigateHelp } from "../../utils/utils/navigateHelp";

import { convertIsoToDateOnly } from "../../utils/utils/formatString";
import { usePricelistList } from "../../api/pricelist/query";
import PricelistTable from "../../components/UI/organisms/Table/Pricelist/PricelistTable";
import PricelistModal from "../../components/UI/organisms/Modal/CustomModal/PricelistModal";

const Pricelist = () => {
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
  } = usePricelistList(queryParams);

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
      <PricelistTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataList, "pricelist")}
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_pricelist");
          setModalData({
            pricelistindex: dataCb.pricelist_index,
            pricelistprice: dataCb.pricelist_price,
            priceliststart: dataCb.pricelist_start,
            pricelistend: dataCb.pricelist_end,
            type: "update",
          });
        }}
        // doHelp={() => {
        //   navigateHelp();
        // }}
        pagination={pagination}
        setPagination={setPagination}
      />
      <PricelistModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Pricelist;
