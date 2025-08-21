import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import WeightTable from "../../components/UI/organisms/Table/Weight/WeightTable";
import { useWeightList } from "../../api/weight/query";
import WeightModal from "../../components/UI/organisms/Modal/CustomModal/WeightModal";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Weight = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [usersearch, setUsersearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  const additionalParams = useMemo(() => {
    const params = {};
    Object.assign(params, {
      usersearch,
    });
    Object.assign(params, {
      page: pagination.pageIndex + 1,
    });
    Object.assign(params, {
      limit: pagination.pageSize,
    });

    return params;
  }, [pagination, usersearch]);

  const queryParams = {
    params: additionalParams,
  };

  const { data: dataUserList, isLoading, refetch } = useWeightList(queryParams);

  const dataList = useMemo(() => dataUserList?.data || [], [dataUserList]);

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
      <WeightTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataList, "weight")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_weight");
          setModalData({
            braceletcode: "",
            scalecode: "",
            weightnumber: "",
            type: "add",
          });
        }}
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
        search={usersearch}
        setSearch={setUsersearch}
      />
      <WeightModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Weight;
