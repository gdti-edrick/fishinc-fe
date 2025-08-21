import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { downloadExcel } from "../../utils/utils/downloadExcel";
import GameTable from "../../components/UI/organisms/Table/Game/GameTable";
import { useGameList } from "../../api/game/query";
import GameModal from "../../components/UI/organisms/Modal/CustomModal/GameModal";
import { navigateHelp } from "../../utils/utils/navigateHelp";

const Game = () => {
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

  const { data: dataGameList, isLoading, refetch } = useGameList(queryParams);

  const dataList = useMemo(() => dataGameList?.data || [], [dataGameList]);

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
      <GameTable
        rowsItems={dataList}
        dataCount={10}
        cbInfo={(item) => console.log("action btn => ", item)}
        isLoadingTable={isLoading}
        doDownload={() => downloadExcel(dataGameList?.data, "game")}
        doAdd={() => {
          setModalVisible(true);
          setModalType("add_change_game");
          setModalData({
            gamecode: "",
            gamename: "",
            gamedesc: "", //allow ""
            gamestart: "01-02-2025 23:00:00",
            gameend: "01-02-2027 23:00:00",
            gamepoint: "",
            type: "add",
          });
        }}
        doEdit={(dataCb) => {
          console.log("dataCb => ", dataCb);
          setModalVisible(true);
          setModalType("add_change_game");
          setModalData({
            gameindex: dataCb.game_index,
            gamecode: dataCb.game_code,
            gamename: dataCb.game_name,
            gamedesc: dataCb.game_desc, //allow ""
            gamestart: dataCb.game_start,
            gameend: dataCb.game_end,
            gamepoint: dataCb.game_point,
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
      <GameModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

export default Game;
