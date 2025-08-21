import { Box, Grid2, Tab, Tabs } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { differenceInMinutes, differenceInSeconds, parseISO } from "date-fns";
import { io } from "socket.io-client";

import { BootSvgIcon } from "../../assets/icons/component";
import { Text } from "../../components/UI/atoms/Typography";
import { BasicButton } from "../../components/UI/atoms/BasicButton";
import { useBookingHomeList } from "../../api/booking/query";
import { useCountdown } from "./useCountdown";
import BasicModal from "../../components/UI/organisms/Modal";
import BookingModal from "../../components/UI/organisms/Modal/CustomModal/Booking";
import { convertMinutesToTime } from "../../utils/utils/minutesToTime";
import { useBookingUnbind } from "../../api/booking/mutation";
import RedeemTab from "./RedeemTab";
import MarketTab from "./MarketTab";

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_SOCKET;

const Home = () => {
  const { data: dataBookingHomeList, refetch } = useBookingHomeList();

  const [tabValue, setTabValue] = React.useState("booking");

  const dataBooked = dataBookingHomeList?.data || [];

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTab = () => {
    switch (tabValue) {
      case "booking":
        return <BookingTab dataBooked={dataBooked} refetch={refetch} />;
      case "redeem":
        return <RedeemTab />;
      case "market":
        return <MarketTab />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 5000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server ✅");
    });

    newSocket.on("connect_error", (err) => {
      console.error("WebSocket Connection Error ❌:", err);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("WebSocket Disconnected ⚠️:", reason);
    });

    // Listen for "monitor" event
    newSocket.on("monitor", (data) => {
      console.log("Received monitor data:", data);
      // setWelcomeData(data);
      if (data === "GET_ALL_DATA") {
        refetch();
        console.log("refetch list-home");
      } else if (data === "list-home") {
        refetch();
        console.log("refetch list-home");
      }
    });

    newSocket.on("myMessage", (message) => {
      console.log("Received myMessage:", message);
    });

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []);

  return (
    <Box sx={{ padding: "16px", height: "96%" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
          centered
          sx={{
            ".Mui-selected": {
              color: `#000000`,
              fontWeight: 900,
            },
          }}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#FFCB10",
            },
          }}
        >
          <Tab
            value="booking"
            label="Booking Seat"
            sx={{
              fontSize: { xs: "9px", sm: "10px", md: "12px" },
              fontWeight: 700,
              textTransform: "none",
              "&.Mui-selected": {
                color: "#000000",
              },
            }}
          />
          <Tab
            value="redeem"
            label="Redeem"
            sx={{
              fontSize: { xs: "9px", sm: "10px", md: "12px" },
              fontWeight: 700,
              textTransform: "none",
              "&.Mui-selected": {
                color: "#000000",
              },
            }}
          />
          <Tab
            value="market"
            label="Market"
            sx={{
              fontSize: { xs: "9px", sm: "10px", md: "12px" },
              fontWeight: 700,
              textTransform: "none",
              "&.Mui-selected": {
                color: "#000000",
              },
            }}
          />
        </Tabs>
      </Box>

      {renderTab()}
    </Box>
  );
};

export default Home;

const BookingTab = ({ key, dataBooked, refetch }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  // const [modalVisible, setModalVisible] = useState(true);
  // const [modalType, setModalType] = useState("success_booking_receipt");
  // const [modalData, setModalData] = useState({
  //   title: "Fishing",
  //   bookingduration: "60",
  //   price: "100000",
  // });

  const bookedSeatsMap = new Map(
    dataBooked.map((booking) => [booking.seat_code, booking])
  );

  const combinedData = dataSeat.map((seat) =>
    bookedSeatsMap.has(seat.seat_code)
      ? bookedSeatsMap.get(seat.seat_code)
      : seat
  );

  const cbBookNow = (item) => {
    console.log("cbBookNow =>", item);
    setModalVisible(true);
    setModalType("book_now");
    setModalData({
      seat_code: item.seat_code,
    });
  };

  const cbRebind = (item) => {
    console.log("cbRebind =>", item);
    setModalVisible(true);
    setModalType("rebind");
    setModalData({ ...item, type: "rebind" });
  };

  const cbUnbind = (item) => {
    console.log("cbExtend =>", item);
    setModalVisible(true);
    setModalType("confirmation");
    setModalData({ ...item, type: "unbind" });
  };

  const cbExtend = (item) => {
    console.log("cbExtend =>", item);
    setModalVisible(true);
    setModalType("extend");
    setModalData(item);
  };
  const cbReprint = (item) => {
    console.log("cbReprint =>", item);
    setModalVisible(true);
    setModalType("success_booking_receipt");
    setModalData({
      title: "Fishing",
      bookingduration: item.booking_duration,
      price: item.booking_payment_price,
      promo: "1234",
      total: "5678",
      seatcode: item.seat_code,
      braceletcode: item.bracelet_code,
      bookingpaymentmethod: item.booking_payment_method,
      userphone: item.user_phone,
      userfullname: item.user_fullname,
      bookingStart: item.booking_start,
      bookingCode: item.booking_code,
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleBraceletCheck = () => {
    setModalVisible(true);
    setModalType("bracelet_check");
    setModalData(null);
  };
  const handlePointCheck = () => {
    setModalVisible(true);
    setModalType("point_check");
    setModalData(null);
  };

  const handleModal = async (item) => {
    console.log("item action 123 mod => ", item);
    switch (item.type) {
      case "success":
        refetch();
        closeModal();
        break;
      case "cancel":
        closeModal();
        break;
      case "success_rebind":
        refetch();
        setModalVisible(true);
        setModalType("success_booking");
        setModalData({
          title: "Success Rebind",
          subtitle:
            "Your rebind has been successfully confirmed. Enjoy your experience!",
        });
        break;
      // case "success_booking_seat":
      //   setModalVisible(true);
      //   setModalType("success_booking");
      //   setModalData({
      //     title: "Success Booking",
      //     subtitle: "Your booking has been successfully confirmed. ",
      //   });
      //   break;
      case "success_booking_seat":
        refetch();
        setModalVisible(true);
        setModalType("success_booking_receipt");
        setModalData({
          title: item.title,
          bookingduration: item.bookingduration,
          price: item.price,
          promo: item.promo,
          total: item.total,
          seatcode: item.seatcode,
          braceletcode: item.braceletcode,
          bookingpaymentmethod: item.bookingpaymentmethod,
          userphone: item.userphone,
          userfullname: item.userfullname,
          bookingStart: item.bookingStart,
          bookingCode: item.bookingCode,
        });
        break;
      case "success_unbind":
        refetch();
        setModalVisible(true);
        setModalType("success_booking");
        setModalData({
          title: "Success Unbind",
          subtitle:
            "Your unbind has been successfully confirmed. Enjoy your experience!",
        });
        break;
      case "success_bracelet":
        refetch();
        setModalVisible(true);
        setModalType("success_bracelet_check");
        setModalData(item);
        break;

      default:
        break;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Box
        sx={{
          display: "flex",
          // flexDirection: "row-reverse",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          <BasicButton
            onClick={handleBraceletCheck}
            sx={{
              backgroundColor: "#231F20",
              border: "1px solid #FDB614",
              color: "#FDB614",
              padding: "4px 12px",
            }}
          >
            Bracelet Check
          </BasicButton>
          <BasicButton
            onClick={handlePointCheck}
            sx={{
              backgroundColor: "#231F20",
              border: "1px solid #FDB614",
              color: "#FDB614",
              padding: "4px 12px",
            }}
          >
            Point Check
          </BasicButton>
        </Box>
        <FishAvailable />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid2
          container
          spacing={{ xs: 1, md: 1 }}
          columns={{ xs: 24, sm: 24, md: 24 }}
        >
          {combinedData.map((item, index) => {
            return (
              <CardHome
                item={item}
                key={item.seat_code || index}
                refetch={refetch}
                cbBookNow={cbBookNow}
                cbRebind={cbRebind}
                cbUnbind={cbUnbind}
                cbExtend={cbExtend}
                cbReprint={cbReprint}
              />
            );
          })}
        </Grid2>
      </Box>
      <BookingModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </Box>
  );
};

const CardHome = ({
  item,
  index,
  refetch,
  cbBookNow,
  cbRebind,
  cbUnbind,
  cbExtend,
  cbReprint,
}) => {
  const [typeColor, setTypeColor] = useState("available");
  const [timeLeft, setTimeLeft] = useState(0);

  const handleRefetch = () => {
    refetch();
    setTypeColor("available");
    setTimeLeft(0);
  };

  useEffect(() => {
    if (!("booking_code" in item)) return;

    const nowUtc = new Date();
    const bookingEnd = parseISO(item.booking_end);
    const timezoneOffsetMinutes = bookingEnd.getTimezoneOffset();

    const remainingMinutes = differenceInMinutes(bookingEnd, nowUtc);
    const remainingSeconds = differenceInSeconds(bookingEnd, nowUtc) % 60;

    const totalRemainingSeconds =
      (remainingMinutes + timezoneOffsetMinutes) * 60 + remainingSeconds;

    setTimeLeft(totalRemainingSeconds);

    setTypeColor(totalRemainingSeconds <= 900 ? "timeUp" : "fishing");

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // handleRefetch();
          return 0;
        } else if (prevTime == 0) {
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [item, handleRefetch]);

  useEffect(() => {
    return () => {
      handleRefetch();
    };
  }, [item]);

  const renderBgColor = () => {
    switch (typeColor) {
      case "available":
        return "rgba(253, 182, 20, 0.45)";
      case "timeUp":
        return "rgba(229, 10, 10, 0.45)";
      case "fishing":
        return "rgba(35, 31, 32, 0.80)";
      default:
        return "rgba(253, 182, 20, 0.45)";
    }
  };

  const renderTextColor = () => {
    switch (typeColor) {
      case "available":
      case "timeUp":
        return "#000000";
      case "fishing":
        return "#FFF6E3";
      default:
        return "#000000";
    }
  };
  const renderStatus = () => {
    switch (typeColor) {
      case "available":
        return "Available";
      case "timeUp":
        return "Time Up";
      case "fishing":
        return "Fishing";
      default:
        return "Available";
    }
  };

  // console.log("index => ", index, typeColor);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const checkminus = (data) => {
    return data < 0 ? 0 : data;
  };

  return (
    <Grid2
      key={index}
      size={{ xs: 2, sm: 4, md: 4 }}
      sx={{
        backgroundColor: renderBgColor(),
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          // alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#FDB614",
              padding: "2px 14px",
              borderBottomRightRadius: "14px",
            }}
          >
            <Text sx={{ fontSize: "16px" }}>{item.seat_code}</Text>
          </Box>
          <Text
            sx={{ fontSize: "14px", fontWeight: 700, color: renderTextColor() }}
          >
            {renderStatus()}
          </Text>
        </Box>
        {/* <Box
          sx={{
            backgroundColor: "#FDB614",
            padding: "0px",
            borderBottomLeftRadius: "14px",
          }}
        >
          {renderStatus() !== "Available" && (
            <BasicButton
              sx={{ margin: "0px", padding: "2px 14px", minWidth: "0px" }}
              onClick={() => cbReprint(item)}
            >
              <Box
                component="img"
                alt="cover test"
                src="https://api.iconify.design/mingcute:print-fill.svg"
              />
            </BasicButton>
          )}
        </Box> */}
      </Box>
      <Box
        sx={{
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text sx={{ color: renderTextColor() }}>Status</Text>
          <Text sx={{ color: renderTextColor() }}>
            {item?.user_displayname ?? "-"}
          </Text>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text sx={{ color: renderTextColor() }}>Remaining</Text>
          <Text sx={{ color: renderTextColor() }}>
            {checkminus(minutes)}:
            {seconds < 10 ? `0${checkminus(seconds)}` : seconds}
          </Text>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text sx={{ color: renderTextColor() }}>Durations</Text>
          <Text sx={{ color: renderTextColor() }}>
            {item?.booking_duration
              ? convertMinutesToTime(item?.booking_duration)
              : "-"}
          </Text>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        {typeColor === "available" ? (
          <BasicButton
            onClick={() => cbBookNow(item)}
            sx={{
              backgroundColor: "#231F20",
              color: "#FDB614",
              padding: "4px 12px",
            }}
          >
            Book Now
          </BasicButton>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
            <BasicButton
              onClick={() => cbRebind(item)}
              sx={{
                backgroundColor: "#FDB614",
                color: "#231F20",
                padding: "4px 12px",
              }}
            >
              Rebind
            </BasicButton>
            <BasicButton
              onClick={() => cbUnbind(item)}
              sx={{
                backgroundColor: "#FDB614",
                color: "#231F20",
                padding: "4px 12px",
              }}
            >
              Unbind
            </BasicButton>
            <BasicButton
              onClick={() => cbExtend(item)}
              sx={{
                backgroundColor: "#FDB614",
                color: "#231F20",
                padding: "4px 12px",
              }}
            >
              Extend
            </BasicButton>
          </Box>
        )}
      </Box>
    </Grid2>
  );
};

const FishAvailable = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: { xs: "16px", sm: "24px", md: "30px" },
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        padding: { xs: "12px 16px", sm: "12px 24px", md: "12px 30px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: { xs: "2px", sm: "10px", md: "16px" },
        }}
      >
        <BootSvgIcon color="#231F20" width="30px" height="30px" />
        <Text
          sx={{
            color: "#231F20",
            fontSize: { xs: "12px", sm: "14px", md: "16px" },
            fontWeight: 700,
          }}
        >
          Fishing
        </Text>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: { xs: "2px", sm: "10px", md: "16px" },
        }}
      >
        <BootSvgIcon color="#FDB614" width="30px" height="30px" />
        <Text
          sx={{
            color: "#FDB614",
            fontSize: { xs: "12px", sm: "14px", md: "16px" },
            fontWeight: 700,
          }}
        >
          Available
        </Text>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: { xs: "2px", sm: "10px", md: "16px" },
        }}
      >
        <BootSvgIcon color="#E50A0A" width="30px" height="30px" />
        <Text
          sx={{
            color: "#E50A0A",
            fontSize: { xs: "12px", sm: "14px", md: "16px" },
            fontWeight: 700,
          }}
        >
          Time Up
        </Text>
      </Box>
    </Box>
  );
};

const dataSeat = [
  { seat_code: "S1" },
  { seat_code: "S2" },
  { seat_code: "S3" },
  { seat_code: "S4" },
  { seat_code: "S5" },
  { seat_code: "S6" },
  { seat_code: "S7" },
  { seat_code: "S8" },
  { seat_code: "S9" },
  { seat_code: "S10" },
  { seat_code: "S11" },
  { seat_code: "S12" },
  { seat_code: "S13" },
  { seat_code: "S14" },
  { seat_code: "S15" },
  { seat_code: "S16" },
  { seat_code: "S17" },
  { seat_code: "S18" },
  { seat_code: "S19" },
  { seat_code: "S20" },
  { seat_code: "S21" },
  { seat_code: "S22" },
  { seat_code: "S23" },
  { seat_code: "S24" },
  { seat_code: "S25" },
  { seat_code: "S26" },
  { seat_code: "S27" },
  { seat_code: "S28" },
  { seat_code: "S29" },
  { seat_code: "S30" },
];
