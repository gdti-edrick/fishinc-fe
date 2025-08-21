import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import { navigateHelp } from "../../utils/utils/navigateHelp";
import PromoTable from "../../components/UI/organisms/Table/Promo/PromoTable";
import { usePromoList } from "../../api/promo/query";
import PromoModal from "../../components/UI/organisms/Modal/CustomModal/PromoModal";
import { convertIsoToDateOnly } from "../../utils/utils/formatString";

const Promo = () => {
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

  const { data: dataPromoList, isLoading, refetch } = usePromoList(queryParams);
  const { data: dataPromoListDownload } = usePromoList({
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
      <PromoTable
        rowsItems={dataPromoList?.data}
        dataCount={10}
        // dataCount={dataAdminList?.data?.count}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataPromoListDownload?.data, "promo")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_promo");
          setModalData({
            promoname: "Test 15%",
            promosource: "Bank Mandiri", // DROPDOWN buat kayak booking create
            promopercentage: "15", // Jika promopercentage diisi, maka promoflat harus 0
            promoflat: "0", // Jika promoflat diisi, maka promopercentage harus 0
            promoexpired: convertIsoToDateOnly("2025-08-29T00:00:00.000Z"), // If promoinfinite = 1, promoexpired = ""
            promoinfinite: "0",
            type: "add",
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
      <PromoModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Promo;
