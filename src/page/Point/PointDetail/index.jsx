import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../../utils/utils/downloadExcel";
import { usePointDetail, usePointList } from "../../../api/point/query";
import PointModal from "../../../components/UI/organisms/Modal/CustomModal/PointModal";
import PointTable from "../../../components/UI/organisms/Table/Point/PointTable";
import PointDetailTable from "../../../components/UI/organisms/Table/Point/PointDetailTable";
import { decryptAES } from "../../../utils/utils/encription";

const PointDetail = () => {
  const query = new URLSearchParams(location.search);

  const encryptedParams = query.get("ecr") || "";

  const decryptedParams = JSON.parse(
    decryptAES(decodeURIComponent(encryptedParams))
  );

  const [userfullname, setUserfullname] = useState(
    decryptedParams.userfullname
  );
  const [userdisplayname, setUserdisplayname] = useState(
    decryptedParams.userdisplayname
  );
  const [userphone, setUserphone] = useState(decryptedParams.userphone);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      userfullname,
    });
    Object.assign(params, {
      userdisplayname,
    });
    Object.assign(params, {
      userphone,
    });

    return params;
  }, [userfullname, userdisplayname, userphone]);

  const queryParams = {
    params: additionalParams,
  };

  const {
    data: dataPointDetailList,
    isLoading,
    refetch,
  } = usePointDetail(queryParams);

  const dataList = useMemo(
    () => dataPointDetailList?.data || [],
    [dataPointDetailList]
  );

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
      <PointDetailTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataPointDetailList?.data, "point")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_point");
          setModalData({
            userfullname,
            userdisplayname,
            userphone,
            pointsum: "",
            eventcode: "DEFAULT",
            gamecode: "",
            pointref: "pointref",
            type: "add",
          });
        }}

        // doDetail={(data) => {
        //   console.log("DATA DETAIL => ", data);
        //   setModalVisible(true);
        //   setModalType("details_point");
        //   setModalData({
        //     userfullname: data?.user_fullname,
        //     userdisplayname: data?.user_displayname,
        //     userphone: data?.user_phone,
        //   });
        // }}
      />
      <PointModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default PointDetail;
