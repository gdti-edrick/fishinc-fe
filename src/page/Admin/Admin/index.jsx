import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";

import { downloadExcel } from "../../../utils/utils/downloadExcel";
import { useAdminList } from "../../../api/admin/query";
import AdminTable from "../../../components/UI/organisms/Table/Admin/AdminTable";
import AdminModal from "../../../components/UI/organisms/Modal/CustomModal/AdminModal";
import { navigateHelp } from "../../../utils/utils/navigateHelp";

const Admin = () => {
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

  const { data: dataAdminList, isLoading, refetch } = useAdminList(queryParams);

  const dataList = useMemo(() => dataAdminList?.data || [], [dataAdminList]);

  const { data: dataAdmiListDownload } = useAdminList({
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
      case "unsuspend_success":
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
      <AdminTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataAdmiListDownload?.data, "admin")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_admin");
          setModalData({
            loginname: "",
            displayname: "",
            firstloginpass: "1", // only 1 or 0
            adminrolecode: "",
            password: "",
            type: "add",
          });
        }}
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_admin");
          setModalData({
            admincode: dataCb.admin_code,
            loginname: dataCb.admin_loginname,
            displayname: dataCb.admin_displayname,
            firstloginpass: dataCb.admin_first_login_pass,
            adminrolecode: dataCb.admin_role_code,
            type: "update",
          });
        }}
        doDelete={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("confirmation");
          setModalData(dataCb);
        }}
        doUnsuspend={(dataCb) => {
          console.log("dataCb unsuspend => ", dataCb);
          setModalVisible(true);
          setModalType("unsuspend");
          setModalData(dataCb);
        }}
        doHelp={() => {
          navigateHelp();
        }}
        pagination={pagination}
        setPagination={setPagination}
      />
      <AdminModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Admin;
