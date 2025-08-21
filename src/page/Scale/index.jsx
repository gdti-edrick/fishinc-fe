import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import { useEntityList } from "../../api/Entity/query";
import ScaleTable from "../../components/UI/organisms/Table/Scale/ScaleTable";
import { useScaleList } from "../../api/scale/query";
import ScaleModal from "../../components/UI/organisms/Modal/CustomModal/ScaleModal";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Scale = () => {
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

  const { data: dataScaleList, isLoading, refetch } = useScaleList(queryParams);
  const { data: dataScaleListDownload } = useScaleList({
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
      <ScaleTable
        rowsItems={dataScaleList?.data}
        dataCount={10}
        // dataCount={dataAdminList?.data?.count}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataScaleListDownload?.data, "scale")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_scale");
          setModalData({
            scalecode: "",
            scaleusername: "",
            scalepassword: "",
            type: "add",
          });
        }}
        doHelp={() => {
          navigateHelp();
        }}
        pagination={pagination}
        setPagination={setPagination}
      />
      <ScaleModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Scale;
