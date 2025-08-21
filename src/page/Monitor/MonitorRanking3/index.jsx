import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./styles.css";

import { Box, Grid2 } from "@mui/material";
import { Text } from "../../../components/UI/atoms/Typography";
import { useMonitorBigSmall, useMonitorDwma } from "../../../api/monitor/query";
import { io } from "socket.io-client";
import { formatThousandSeparator } from "../../../utils/utils/formatThousandSeparator";
import sound01 from "/assets/sounds/01.mp3";
import sound02 from "/assets/sounds/02.mp3";
import sound03 from "/assets/sounds/03.mp3";
import sound04 from "/assets/sounds/04.mp3";

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_SOCKET;

function MonitorRanking3() {
  const [topDay, setTopDay] = useState([]);
  const [topWeek, setTopWeek] = useState([]);
  const [topMonth, setTopMonth] = useState([]);
  const [topAll, setTopAll] = useState([]);

  const [topDayList, setTopDayList] = useState([]);
  const [topWeekList, setTopWeekList] = useState([]);
  const [topMonthList, setTopMonthList] = useState([]);
  const [topAllList, setTopAllList] = useState([]);

  const elementsRef = useRef({
    day: {},
    week: {},
    month: {},
    all: {},
  });
  const prevListsRef = useRef({
    topDayList: [],
    topWeekList: [],
    topMonthList: [],
    topAllList: [],
  });
  const isInitialMount = useRef(true);
  const prevElementsPositionRef = useRef({});

  const { data: dataMonitorDwma, refetch: refetchMonitorDwma } =
    useMonitorDwma();
  const { data: dataMonitorBigSmall, refetch: refetchMonitorBigSmall } =
    useMonitorBigSmall();

  console.log("dataMonitorDwma => ", dataMonitorDwma);
  console.log("dataMonitorBigSmall => ", dataMonitorBigSmall);

  const playSound = (src) => {
    const audio = new Audio(src);
    audio.play();
  };

  useEffect(() => {
    const dayOriginal = dataMonitorDwma?.data?.day || [];
    const dayArray = Array.from(
      { length: 5 },
      (_, i) => dayOriginal[i] || { total_weight: "", user_displayname: "" }
    );
    setTopDay(dayArray);
    const dayStringArray = dataMonitorDwma?.data?.day.map(
      (item) => item.user_displayname
    );
    setTopDayList(dayStringArray);

    const weekOriginal = dataMonitorDwma?.data?.week || [];
    const weekArray = Array.from(
      { length: 5 },
      (_, i) => weekOriginal[i] || { total_weight: "", user_displayname: "" }
    );
    setTopWeek(weekArray);
    const weekStringArray = dataMonitorDwma?.data?.week.map(
      (item) => item.user_displayname
    );
    setTopWeekList(weekStringArray);

    const monthOriginal = dataMonitorDwma?.data?.week || [];
    const monthArray = Array.from(
      { length: 5 },
      (_, i) => monthOriginal[i] || { total_weight: "", user_displayname: "" }
    );
    setTopMonth(monthArray);
    const monthStringArray = dataMonitorDwma?.data?.month.map(
      (item) => item.user_displayname
    );
    setTopMonthList(monthStringArray);

    const allOriginal = dataMonitorDwma?.data?.week || [];
    const allArray = Array.from(
      { length: 5 },
      (_, i) => allOriginal[i] || { total_weight: "", user_displayname: "" }
    );
    setTopAll(allArray);
    const allStringArray = dataMonitorDwma?.data?.all.map(
      (item) => item.user_displayname
    );
    setTopAllList(allStringArray);
  }, [dataMonitorDwma]);

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

    newSocket.on("monitor", (data) => {
      console.log("Received monitor data:", data);
      if (data === "GET_ALL_DATA") {
        refetchMonitorDwma();
        refetchMonitorBigSmall();
        console.log("refetch all");
      } else if (data === "top-dwma") {
        refetchMonitorDwma();
        console.log("refetch dwma");
      }
    });

    newSocket.on("myMessage", (message) => {
      console.log("Received myMessage:", message);
    });

    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const fn = () => {
      const allNewPositions = {};

      for (const category of ["day", "week", "month", "all"]) {
        const categoryRef = elementsRef.current[category];
        allNewPositions[category] = {};

        for (const [key, element] of Object.entries(categoryRef)) {
          if (!element) continue;
          const elPosition = element.getBoundingClientRect();

          allNewPositions[category][key] = {
            top: elPosition.top,
            left: elPosition.left,
          };

          const prev = prevElementsPositionRef.current?.[category]?.[key];
          if (prev) {
            const deltaY = prev.top - elPosition.top;
            const deltaX = prev.left - elPosition.left;

            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            element.style.transition = "transform 0s";
          }
        }
      }

      prevElementsPositionRef.current = allNewPositions;

      requestAnimationFrame(() => {
        for (const categoryRef of Object.values(elementsRef.current)) {
          Object.values(categoryRef).forEach((element) => {
            if (!element) return;
            element.style.transform = "";
            element.style.transition = "transform 1s";
          });
        }
      });
    };

    const id = requestAnimationFrame(fn);
    return () => cancelAnimationFrame(id);
  }, [topDay, topWeek, topMonth, topAll]);

  useEffect(() => {
    const newTopDayList =
      dataMonitorDwma?.data?.day.map((item) => item.user_displayname) || [];
    const newTopWeekList =
      dataMonitorDwma?.data?.week.map((item) => item.user_displayname) || [];
    const newTopMonthList =
      dataMonitorDwma?.data?.month.map((item) => item.user_displayname) || [];
    const newTopAllList =
      dataMonitorDwma?.data?.all.map((item) => item.user_displayname) || [];

    const isDifferent = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

    // Lewati pengecekan dan suara jika ini pertama kali halaman render
    if (!isInitialMount.current) {
      if (isDifferent(newTopAllList, prevListsRef.current.topAllList)) {
        playSound(sound04);
      } else if (
        isDifferent(newTopMonthList, prevListsRef.current.topMonthList)
      ) {
        playSound(sound03);
      } else if (
        isDifferent(newTopWeekList, prevListsRef.current.topWeekList)
      ) {
        playSound(sound02);
      } else if (isDifferent(newTopDayList, prevListsRef.current.topDayList)) {
        playSound(sound01);
      }
    } else {
      isInitialMount.current = false; // Set ke false setelah mount pertama
    }

    // Simpan data saat ini ke ref
    prevListsRef.current.topDayList = newTopDayList;
    prevListsRef.current.topWeekList = newTopWeekList;
    prevListsRef.current.topMonthList = newTopMonthList;
    prevListsRef.current.topAllList = newTopAllList;

    // Update ke state untuk ditampilkan
    const makeArray = (original) =>
      Array.from(
        { length: 5 },
        (_, i) => original[i] || { total_weight: "", user_displayname: "" }
      );

    setTopDay(makeArray(dataMonitorDwma?.data?.day || []));
    setTopDayList(newTopDayList);

    setTopWeek(makeArray(dataMonitorDwma?.data?.week || []));
    setTopWeekList(newTopWeekList);

    setTopMonth(makeArray(dataMonitorDwma?.data?.month || []));
    setTopMonthList(newTopMonthList);

    setTopAll(makeArray(dataMonitorDwma?.data?.all || []));
    setTopAllList(newTopAllList);
  }, [dataMonitorDwma]);

  return (
    <Box
      sx={{
        backgroundImage: "url('monitor_leaderboard_bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Grid2
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{
          height: "100vh", // Full screen height
          boxSizing: "border-box",
        }}
      >
        <BestList
          title="Best overall"
          data={topAll}
          elementsRef={elementsRef.current.all}
          sx={{
            padding: "30px 0px 30px 60px",
            alignItems: "flex-start",
          }}
          titleStyle={{
            color: "#FDB614",
          }}
          numberStyle={{
            color: "#FFFFFF",
          }}
        />

        <BestList
          title="Best of The Month"
          data={topMonth}
          elementsRef={elementsRef.current.month}
          sx={{
            padding: "30px 60px 30px 0px",
            alignItems: "flex-end",
          }}
          titleStyle={{
            color: "#FDB614",
          }}
          numberStyle={{
            color: "#FFFFFF",
          }}
        />

        <BestList
          title="Best of The Week"
          data={topWeek}
          elementsRef={elementsRef.current.week}
          sx={{
            padding: "30px 0px 30px 60px",
            alignItems: "flex-start",
            justifyContent: "end",
            color: "#000000",
          }}
          titleStyle={{ color: "#000000" }}
          numberStyle={{
            color: "#000000",
          }}
        />

        <BestList
          title="Best of The Day"
          data={topDay}
          elementsRef={elementsRef.current.day}
          sx={{
            padding: "30px 60px 30px 0px",
            alignItems: "flex-end",
            justifyContent: "end",
          }}
          titleStyle={{ color: "#000000" }}
          numberStyle={{
            color: "#000000",
          }}
        />
      </Grid2>
    </Box>
  );
}

export default MonitorRanking3;

const BestList = ({
  title,
  data,
  elementsRef,
  sx,
  titleStyle,
  numberStyle,
}) => {
  const ordinal = ["st", "nd", "rd", "th", "th"];
  return (
    <Grid2
      size={{ xs: 2, sm: 4, md: 6 }}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        height: "50vh",
        ...sx,
      }}
    >
      <Text
        variant="h2"
        sx={{
          fontWeight: 900,
          color: "#FFFFFF",
          textTransform: "uppercase",
          ...titleStyle,
        }}
      >
        {title}
      </Text>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              // color: "#FFFFFF",
              ...numberStyle,
            }}
            className="tr"
            ref={(el) => {
              elementsRef[item.user_displayname] = el;
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                minWidth: "60px",
              }}
              className="td"
            >
              <Text variant={"h2"} sx={{ fontWeight: 900 }}>
                {index + 1}
              </Text>
              <Text
                sx={{
                  fontWeight: 900,
                  fontSize: "18px",
                  padding: "6px 0px",
                }}
              >
                {ordinal[index]}
              </Text>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "620px",
                backgroundColor: "#FFFFFF",
                color: "#000000",
                padding: "10px",
              }}
              className="td"
            >
              <Text variant="h4" sx={{ fontWeight: 600 }}>
                {item.user_displayname}
              </Text>
              {item.total_weight !== "" && (
                <Text sx={{ fontWeight: 800, fontSize: "36px" }}>
                  {formatThousandSeparator(item.weight_number)} gram
                </Text>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Grid2>
  );
};
