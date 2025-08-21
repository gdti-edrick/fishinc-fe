import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../../utils/utils/downloadExcel";
import { decryptAES } from "../../../utils/utils/encription";
import { useEventDetail } from "../../../api/event/query";
import EventDetailTable from "../../../components/UI/organisms/Table/Event/EventDetailTable";
import EventModal from "../../../components/UI/organisms/Modal/CustomModal/EventModal";

const EventDetail = () => {
  const query = new URLSearchParams(location.search);

  const encryptedParams = query.get("ecr") || "";
  // console.log("encryptedParams => ", encryptedParams);

  let decryptedParams = {};
  if (encryptedParams) {
    decryptedParams = JSON.parse(
      decryptAES(decodeURIComponent(encryptedParams))
    );
  }

  // console.log("decryptedParams => ", decryptedParams);

  const [eventcode, setEventcode] = useState(
    decryptedParams?.eventcode || "DEFAULT"
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  const additionalParams = useMemo(() => {
    const params = {};

    Object.assign(params, {
      eventcode,
    });
    Object.assign(params, {
      page: 1,
    });
    Object.assign(params, {
      limit: 1000,
    });

    return params;
  }, [eventcode]);

  const queryParams = {
    params: additionalParams,
  };

  const {
    data: dataEventDetailList,
    isLoading,
    refetch,
  } = useEventDetail(queryParams);

  const dataList = useMemo(
    () => dataEventDetailList?.data || [],
    [dataEventDetailList]
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
      <EventDetailTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() =>
          downloadExcel(dataEventDetailList?.data, "event_point")
        }
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_event_detail");
          setModalData({
            eventcode: eventcode,
            eventpointminweight: "",
            eventpointmaxweight: "",
            eventpointsumpoint: "",
            type: "add",
          });
        }}
        doEdit={(dataCb) => {
          setModalVisible(true);
          setModalType("add_change_event_detail");
          setModalData({
            eventcode: dataCb.event_code,
            eventpointcode: dataCb.event_point_code,
            eventpointminweight: dataCb.event_point_min_weight,
            eventpointmaxweight: dataCb.event_point_max_weight,
            eventpointsumpoint: dataCb.event_point_sum_point,
            type: "update",
          });
        }}
        doDelete={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("confirmation_detail");
          setModalData(dataCb);
        }}
      />
      <EventModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default EventDetail;
