import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../../utils/utils/downloadExcel";
import { decryptAES } from "../../../utils/utils/encription";
import { useProductStock } from "../../../api/product/query";
import ProductModal from "../../../components/UI/organisms/Modal/CustomModal/ProductModal";
import ProductDetailTable from "../../../components/UI/organisms/Table/Product/ProductDetailTable";
import { useTransactionDetail } from "../../../api/transaction/query";
import TransactionDetailTable from "../../../components/UI/organisms/Table/Transaction/TransactionDetailTable";

const TransactionDetail = () => {
  const query = new URLSearchParams(location.search);

  const encryptedParams = query.get("ecr") || "";
  // console.log("encryptedParams => ", encryptedParams);

  const decryptedParams = JSON.parse(
    decryptAES(decodeURIComponent(encryptedParams))
  );

  // console.log("decryptedParams => ", decryptedParams);

  const [transactioncode, setTransactioncode] = useState(
    decryptedParams.transactioncode
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      transactioncode,
    });
    Object.assign(params, {
      page: 1,
    });
    Object.assign(params, {
      limit: 1000,
    });

    return params;
  }, [transactioncode]);

  const queryParams = {
    params: additionalParams,
  };

  const {
    data: dataProductStock,
    isLoading,
    refetch,
  } = useTransactionDetail(queryParams);

  const dataList = useMemo(
    () => dataProductStock?.data || [],
    [dataProductStock]
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
      <TransactionDetailTable
        tableTitle={`${transactioncode}`}
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        // doDownload={() =>
        //   downloadExcel(dataProductStock?.data, "product_stock")
        // }
      />
      <ProductModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default TransactionDetail;
