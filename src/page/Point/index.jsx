import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import { usePointList } from "../../api/point/query";
import PointModal from "../../components/UI/organisms/Modal/CustomModal/PointModal";
import PointTable from "../../components/UI/organisms/Table/Point/PointTable";
import { encryptAES } from "../../utils/utils/encription";
import { useNavigate } from "react-router-dom";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Point = () => {
  const navigate = useNavigate();

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

  const { data: dataPointList, isLoading, refetch } = usePointList(queryParams);

  const dataList = useMemo(
    () => (dataPointList?.data || []).filter((item) => item.user_status !== 0),
    [dataPointList]
  );

  const { data: dataPointListDownload } = usePointList({
    params: {
      page: 1,
      limit: 10000,
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

  const handleDetail = (detail) => {
    const paramsObj = {
      userfullname: detail.userfullname,
      userdisplayname: detail.userdisplayname,
      userphone: detail.userphone,
    };
    const encryptedParams = encryptAES(JSON.stringify(paramsObj));
    const params = new URLSearchParams({
      ecr: encryptedParams,
    });
    navigate(`/point/detail?${params.toString()}`);
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <PointTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataPointListDownload?.data, "point")}
        // doAdd={() => {
        //   setModalVisible(true);
        //   setModalType("add_change_point");
        //   setModalData({
        //     userphone: "87831511916",
        //     userfullname: "",
        //     userdisplayname: "",
        //     pointsum: "",
        //     eventcode: "DEFAULT",
        //     pointref: "pointref",
        //     type: "add",
        //   });
        // }}
        doDetail={(data) =>
          handleDetail({
            userfullname: data?.user_fullname,
            userdisplayname: data?.user_displayname,
            userphone: data?.user_phone,
          })
        }
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
        doHelp={() => {
          navigateHelp();
        }}
        pagination={pagination}
        setPagination={setPagination}
        search={usersearch}
        setSearch={setUsersearch}
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

export default Point;
