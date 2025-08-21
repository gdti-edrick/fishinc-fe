import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import { encryptAES } from "../../utils/utils/encription";
import { useNavigate } from "react-router-dom";
import EventModal from "../../components/UI/organisms/Modal/CustomModal/EventModal";
import { useProductList } from "../../api/product/query";
import ProductTable from "../../components/UI/organisms/Table/Product/ProductTable";
import ProductModal from "../../components/UI/organisms/Modal/CustomModal/ProductModal";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Product = () => {
  const navigate = useNavigate();

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
    data: dataProductList,
    isLoading,
    refetch,
  } = useProductList(queryParams);

  const dataList = useMemo(
    () => dataProductList?.data || [],
    [dataProductList]
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

  const handleDetail = (detail) => {
    console.log("detail action => ", detail);
    const paramsObj = {
      productcode: detail.productcode,
      productname: detail.productname,
    };
    const encryptedParams = encryptAES(JSON.stringify(paramsObj));
    const params = new URLSearchParams({
      ecr: encryptedParams,
    });
    navigate(`/product/stock?${params.toString()}`);
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <ProductTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataProductList?.data, "product")}
        // doRefresh={() => refetch()}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_product");
          setModalData({
            productcode: "",
            productname: "",
            productcategorycode: "FNB",
            productpriceidr: "0",
            productpricepoint: "0",
            type: "add",
          });
        }}
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_product");
          setModalData({
            productcode: dataCb.product_code,
            productname: dataCb.product_name,
            productcategorycode: dataCb.product_category_code,
            productpriceidr: dataCb.product_price_idr,
            productpricepoint: dataCb.product_price_point,
            type: "update",
          });
        }}
        doDelete={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("confirmation");
          setModalData(dataCb);
        }}
        doDetail={(data) =>
          handleDetail({
            productcode: data?.product_code,
            productname: data?.product_name,
          })
        }
        doStock={() => {
          navigate(`/product/stock_list`);
        }}
        doAddStock={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_product_detail");
          setModalData({
            productcode: dataCb.product_code,
            productname: dataCb.product_name,
            vendorcode: "", //dropdown vendor
            productstockdesc: "", //wajib diisi dan ini note
            productstockqty: "", //jumlah dalam satuan pcs, bisa minus
            productstockbuy: "", //harga beli per pcs
            productstockdiscount: "", //diskon per pcs
            type: "add",
          });
        }}
        doHelp={() => {
          navigateHelp();
        }}
        pagination={pagination}
        setPagination={setPagination}
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

export default Product;
