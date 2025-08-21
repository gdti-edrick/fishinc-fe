import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";

import { useAdminRoleList } from "../../../api/admin/query";
import { downloadExcel } from "../../../utils/utils/downloadExcel";
import AdminRoleTable from "../../../components/UI/organisms/Table/Admin/AdminRoleTable";
import AdminRoleModal from "../../../components/UI/organisms/Modal/CustomModal/AdminRoleModal";
import { getLocalStorageCRUD } from "../../../utils/utils/getLocalStorage";
import { sidebarMenuItems } from "../../../utils/utils/pathList";
import { navigateHelp } from "../../../utils/utils/navigateHelp";

const AdminRole = () => {
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
    data: dataAdminRoleList,
    isLoading,
    refetch,
  } = useAdminRoleList(queryParams);

  const dataList = useMemo(
    () => dataAdminRoleList?.data || [],
    [dataAdminRoleList]
  );

  const { data: dataAdminRoleListDownload } = useAdminRoleList({
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
      <AdminRoleTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() =>
          downloadExcel(dataAdminRoleListDownload?.data, "admin_role")
        }
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_admin_role");
          setModalData({
            adminrolecode: "",
            roledesc: "",
            type: "add",
          });
        }}
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_admin_role");
          setModalData({
            adminroleindex: dataCb.admin_role_index,
            adminrolecode: dataCb.admin_role_code,
            roledesc: dataCb.admin_role_desc,
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
      <AdminRoleModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default AdminRole;
