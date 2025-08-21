import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";

import { useAdminCrudList } from "../../../api/admin/query";
import AdminCrudTable from "../../../components/UI/organisms/Table/Admin/AdminCrudTable";
import { downloadExcel } from "../../../utils/utils/downloadExcel";
import AdminModal from "../../../components/UI/organisms/Modal/CustomModal/AdminModal";
import { navigateHelp } from "../../../utils/utils/navigateHelp";

const AdminCrud = () => {
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
    data: dataAdminList,
    isLoading,
    refetch,
  } = useAdminCrudList(queryParams);
  const { data: dataAdminListDownload, isLoading: isDownloadLoading } =
    useAdminCrudList({
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
      <AdminCrudTable
        rowsItems={dataAdminList?.data}
        dataCount={10}
        // dataCount={dataAdminList?.data?.count}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() =>
          downloadExcel(dataAdminListDownload?.data, "admin_crud")
        }
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_admin_crud");
          setModalData({
            admincrudcode: dataCb.admin_crud_code,
            adminrulecode: dataCb.admin_role_code,
            entityCode: dataCb.entity_code,
            c: dataCb.admin_crud_permission_c,
            r: dataCb.admin_crud_permission_r,
            u: dataCb.admin_crud_permission_u,
            d: dataCb.admin_crud_permission_d,
            type: "update",
          });
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

export default AdminCrud;
