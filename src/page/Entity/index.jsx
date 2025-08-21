import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import { useEntityList } from "../../api/Entity/query";
import EntityTable from "../../components/UI/organisms/Table/Entity/EntityTable";
import EntityModal from "../../components/UI/organisms/Modal/CustomModal/EntityModal";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Entity = () => {
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
    data: dataEntityList,
    isLoading,
    refetch,
  } = useEntityList(queryParams);

  const dataList = useMemo(() => dataEntityList?.data || [], [dataEntityList]);

  const { data: dataEntityListDownload } = useEntityList({
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
      <EntityTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataEntityListDownload?.data, "entity")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_entity");
          setModalData({
            entitycode: "",
            newentitycode: "", // only for update
            entitysort: "",
            type: "add",
          });
        }}
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_entity");
          setModalData({
            entityindex: dataCb.entity_index,
            entitycode: dataCb.entity_code,
            newentitycode: "",
            entitysort: dataCb.entity_sort,
            type: "update",
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
      />
      <EntityModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Entity;
