import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import PointModal from "../../components/UI/organisms/Modal/CustomModal/PointModal";
import { encryptAES } from "../../utils/utils/encription";
import { useNavigate } from "react-router-dom";
import { useEventList } from "../../api/event/query";
import EventTable from "../../components/UI/organisms/Table/Event/EventTable";
import EventModal from "../../components/UI/organisms/Modal/CustomModal/EventModal";
import {
  convertIsoToDateOnly,
  convertToIsoDate,
} from "../../utils/utils/formatString";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Event = () => {
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

  const { data: dataEventList, isLoading, refetch } = useEventList(queryParams);

  // const dataList = useMemo(
  //   () => (dataEventList?.data || []).filter((item) => item.event_status !== 0),
  //   [dataEventList]
  // );

  const dataList = useMemo(() => dataEventList?.data || [], [dataEventList]);
  console.log("dataList => ", dataList[0].event_code);

  useEffect(() => {
    if (dataList.length > 0) {
      handleDetail({
        eventcode: dataList[0].event_code,
      });
    }
  }, [dataList]);

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
      eventcode: detail.eventcode,
    };
    const encryptedParams = encryptAES(JSON.stringify(paramsObj));
    const params = new URLSearchParams({
      ecr: encryptedParams,
    });
    navigate(`/event/detail?${params.toString()}`);
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <EventTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataEventList?.data, "event")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_event");
          setModalData({
            eventcode: "",
            eventname: "",
            eventdesc: "", //allow ""
            eventstart: convertToIsoDate("01-02-2025 23:00:00"),
            eventend: convertToIsoDate("01-02-2027 23:00:00"),
            eventprice: "",
            eventdiscount: "0", //diskon berapa rupiah
            type: "add",
          });
        }}
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_event");
          setModalData({
            eventindex: dataCb.event_index,
            eventcode: dataCb.event_code,
            eventname: dataCb.event_name,
            eventdesc: dataCb.event_desc, //allow ""
            eventstart: convertIsoToDateOnly(dataCb.event_start),
            eventend: convertIsoToDateOnly(dataCb.event_end),
            eventprice: dataCb.event_ticket_price,
            eventdiscount: dataCb.event_ticket_discount, //diskon berapa rupiah
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
            eventcode: data?.event_code,
          })
        }
        doHelp={() => {
          navigateHelp();
        }}
        pagination={pagination}
        setPagination={setPagination}
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

export default Event;
