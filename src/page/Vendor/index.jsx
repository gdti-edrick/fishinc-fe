import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import UserModal from "../../components/UI/organisms/Modal/CustomModal/UserModal";
import { useVendorList } from "../../api/vendor/query";
import VendorTable from "../../components/UI/organisms/Table/Vendor/VendorTable";
import VendorModal from "../../components/UI/organisms/Modal/CustomModal/VendorModal";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Vendor = () => {
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

  const { data: dataUserList, isLoading, refetch } = useVendorList(queryParams);

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
      <VendorTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataUserList?.data, "vendor")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_vendor");
          setModalData({
            vendorcode: "",
            vendorname: "",
            vendordesc: "", //allow ""
            type: "add",
          });
        }}
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_vendor");
          setModalData({
            vendorindex: dataCb.vendor_index,
            vendorcode: dataCb.vendor_code,
            vendorname: dataCb.vendor_name,
            vendordesc: dataCb.vendor_desc, //allow ""
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
      <VendorModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Vendor;
