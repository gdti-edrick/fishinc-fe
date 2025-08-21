import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../../utils/utils/downloadExcel";
import { decryptAES } from "../../../utils/utils/encription";
import { useProductStock } from "../../../api/product/query";
import ProductModal from "../../../components/UI/organisms/Modal/CustomModal/ProductModal";
import ProductDetailTable from "../../../components/UI/organisms/Table/Product/ProductDetailTable";

const ProductDetail = () => {
  const query = new URLSearchParams(location.search);

  const encryptedParams = query.get("ecr") || "";
  // console.log("encryptedParams => ", encryptedParams);

  const decryptedParams = JSON.parse(
    decryptAES(decodeURIComponent(encryptedParams))
  );

  // console.log("decryptedParams => ", decryptedParams);

  const [productcode, setProductcode] = useState(decryptedParams.productcode);
  const [productname, setProductname] = useState(decryptedParams.productname);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      productcode,
    });
    Object.assign(params, {
      page: 1,
    });
    Object.assign(params, {
      limit: 1000,
    });

    return params;
  }, [productcode]);

  const queryParams = {
    params: additionalParams,
  };

  const {
    data: dataProductStock,
    isLoading,
    refetch,
  } = useProductStock(queryParams);

  const dataList = useMemo(
    () =>
      (dataProductStock?.data || []).filter(
        (item) => item.product_stock_status !== 0
      ),
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
      <ProductDetailTable
        tableTitle={`${productname} Stock`}
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() =>
          downloadExcel(dataProductStock?.data, "product_stock")
        }
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_product_detail");
          setModalData({
            productcode: productcode,
            productname: productname,
            vendorcode: "", //dropdown vendor
            productstockdesc: "", //wajib diisi dan ini note
            productstockqty: "", //jumlah dalam satuan pcs, bisa minus
            productstockbuy: "", //harga beli per pcs
            productstockdiscount: "", //diskon per pcs
            type: "add",
          });
        }}
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

export default ProductDetail;
