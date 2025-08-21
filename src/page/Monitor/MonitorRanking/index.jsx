import { Box, Grid2 } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { Text } from "../../../components/UI/atoms/Typography";
import {
  useMonitorBigSmall,
  useMonitorDwma,
  useMonitorInfo,
} from "../../../api/monitor/query";
import { io } from "socket.io-client";
import { formatThousandSeparator } from "../../../utils/utils/formatThousandSeparator";

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_SOCKET;

function MonitorRanking() {
  const {
    data: dataMonitorDwma,
    refetch: refetchMonitorDwma,
    isLoading: isLoadingDwma,
  } = useMonitorDwma();
  const { data: dataMonitorInfo, refetch: refetchMonitorInfo } =
    useMonitorInfo();
  const { data: dataMonitorBigSmall, refetch: refetchMonitorBigSmall } =
    useMonitorBigSmall();

  const topDay = useMemo(
    () => dataMonitorDwma?.data?.day || [],
    [dataMonitorDwma]
  );
  const topWeek = useMemo(
    () => dataMonitorDwma?.data?.week || [],
    [dataMonitorDwma]
  );
  const topMonth = useMemo(
    () => dataMonitorDwma?.data?.month || [],
    [dataMonitorDwma]
  );
  const topAll = useMemo(
    () => dataMonitorDwma?.data?.all || [],
    [dataMonitorDwma]
  );

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
        refetchMonitorDwma();
        refetchMonitorInfo();
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

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []);

  return (
    <Box sx={{}}>
      <Grid2
        container
        // spacing={{ xs: 1 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{
          // display: "flex",
          // flexDirection: "row",
          // width: "100vw", // Full screen width
          height: "100vh", // Full screen height
          // gap: "8px", // Adds spacing between sections
          // padding: "8px", // Optional padding to prevent clipping
          boxSizing: "border-box",
        }}
      >
        <Grid2
          size={{ xs: 2, sm: 4, md: 6 }}
          sx={{
            flex: 1,
            backgroundColor: "lightgray",
            display: "flex",
            padding: "30px 0px",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            height: "50vh",
          }}
        >
          <Text variant="h3" sx={{ fontWeight: 500 }}>
            Top of The All
          </Text>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {topAll.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <Text variant="h4" sx={{ fontWeight: 600, width: "240px" }}>
                  {item.user_displayname}
                </Text>
                <Text variant="h4" sx={{ fontWeight: 600 }}>
                  {formatThousandSeparator(item.total_weight)} gram
                </Text>
              </Box>
            ))}
          </Box>
        </Grid2>

        <Grid2
          size={{ xs: 2, sm: 4, md: 6 }}
          sx={{
            flex: 1,
            backgroundColor: "lightblue",
            display: "flex",
            padding: "30px 0px",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            height: "50vh",
          }}
        >
          <Text variant="h3" sx={{ fontWeight: 500 }}>
            Top of The Month
          </Text>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {topMonth.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <Text variant="h4" sx={{ fontWeight: 600, width: "240px" }}>
                  {item.user_displayname}
                </Text>
                <Text variant="h4" sx={{ fontWeight: 600 }}>
                  {formatThousandSeparator(item.total_weight)} gram
                </Text>
              </Box>
            ))}
          </Box>
        </Grid2>

        <Grid2
          size={{ xs: 2, sm: 4, md: 6 }}
          sx={{
            flex: 1,
            backgroundColor: "lightcoral",
            display: "flex",
            padding: "30px 0px",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            height: "50vh",
          }}
        >
          <Text variant="h3" sx={{ fontWeight: 500 }}>
            Top of The Week
          </Text>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {topWeek.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <Text variant="h4" sx={{ fontWeight: 600, width: "240px" }}>
                  {item.user_displayname}
                </Text>
                <Text variant="h4" sx={{ fontWeight: 600 }}>
                  {formatThousandSeparator(item.total_weight)} gram
                </Text>
              </Box>
            ))}
          </Box>
        </Grid2>

        <Grid2
          size={{ xs: 2, sm: 4, md: 6 }}
          sx={{
            flex: 1,
            backgroundColor: "lightgreen",
            display: "flex",
            padding: "30px 0px",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            height: "50vh",
          }}
        >
          <Text variant="h3" sx={{ fontWeight: 500 }}>
            Top of The Day
          </Text>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {topDay.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <Text variant="h4" sx={{ fontWeight: 600, width: "240px" }}>
                  {item.user_displayname}
                </Text>
                <Text variant="h4" sx={{ fontWeight: 600 }}>
                  {formatThousandSeparator(item.total_weight)} gram
                </Text>
              </Box>
            ))}
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default MonitorRanking;
