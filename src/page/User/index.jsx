import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import { useUserList } from "../../api/user/query";
import UserTable from "../../components/UI/organisms/Table/User/UserTable";
import UserModal from "../../components/UI/organisms/Modal/CustomModal/UserModal";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const User = () => {
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

  const { data: dataUserList, isLoading, refetch } = useUserList(queryParams);

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
      <UserTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataList, "user")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_user");
          setModalData({
            userfullname: "",
            userdisplayname: "", //isi default mengikuti userfullname
            usercountrycode: "62", //kode negara tanpa "+"
            userphone: "", //nomor tanpa 0 atau kode negara
            useremail: "", //optional tapi string ""
            type: "add",
          });
        }}
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_user");
          setModalData({
            userfullname: dataCb.user_fullname,
            userdisplayname: dataCb.user_displayname,
            usercountrycode: `${dataCb.user_countrycode}`,
            userphone: dataCb.user_phone,
            useremail: dataCb.user_email,
            usercode: dataCb.user_code,
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
        search={usersearch}
        setSearch={setUsersearch}
      />
      <UserModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default User;
