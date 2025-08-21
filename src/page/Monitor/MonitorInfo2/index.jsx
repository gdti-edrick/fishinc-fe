import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid2,
  CircularProgress,
} from "@mui/material";
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

function MonitorInfo2() {
  const { data: dataMonitorDwma, refetch: refetchMonitorDwma } =
    useMonitorDwma();
  const {
    data: dataMonitorInfo,
    refetch: refetchMonitorInfo,
    isLoading: isLoadingInfo,
  } = useMonitorInfo();
  const { data: dataMonitorBigSmall, refetch: refetchMonitorBigSmall } =
    useMonitorBigSmall();

  const gameAngkaKembar = useMemo(
    () => dataMonitorInfo?.data?.game_angka_kembar || [],
    [dataMonitorInfo]
  );
  const infoPoint = useMemo(
    () => dataMonitorInfo?.data?.info_point || [],
    [dataMonitorInfo]
  );
  const gameTop = useMemo(
    () => dataMonitorInfo?.data?.game_top || [],
    [dataMonitorInfo]
  );
  const dataBig = useMemo(
    () => dataMonitorBigSmall?.data?.big || [],
    [dataMonitorBigSmall]
  );
  const dataSmall = useMemo(
    () => dataMonitorBigSmall?.data?.small || [],
    [dataMonitorBigSmall]
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
      } else if (data === "info") {
        refetchMonitorInfo();
        console.log("refetch info");
      } else if (data === "bigsmall") {
        refetchMonitorBigSmall();
        console.log("refetch big small");
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        gap: "8px",
        boxSizing: "border-box",
        paddingTop: "18px",
      }}
    >
      <Text variant="h3" sx={{ fontWeight: 600 }}>
        INFORMATION
      </Text>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          gap: "8px",
          padding: "8px",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundColor: "lightgray",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "12px 32px",
            overflow: "scroll",
          }}
        >
          <InfoPointTable data={infoPoint} isLoading={isLoadingInfo} />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px", // Adds spacing between top and bottom sections
          }}
        >
          {/* DATA BIG */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "lightblue",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "12px 10px",
            }}
          >
            <GameAngkaKembar data={gameAngkaKembar} />
          </Box>
          {/* DATA SMALL */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "beige",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "0px 140px",
            }}
          >
            {gameTop.map((item, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                <Text variant="h4" sx={{ fontWeight: 600 }}>
                  {item.game_code}
                </Text>
                <Text variant="h4">{item.game_name}</Text>
                <Text variant="h4">{item.game_point} kg</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MonitorInfo2;

const InfoPointTable = ({ data, isLoading }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        width: "100%",
        padding: "16px",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: "16px" }}>
        Event Points Table
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", boxShadow: 3, overflow: "hidden" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976D2" }}>
            <TableRow>
              <TableCell sx={headerStyle}>Min Weight (kg)</TableCell>
              <TableCell sx={headerStyle}>Max Weight (kg)</TableCell>
              <TableCell sx={headerStyle}>Sum Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{ textAlign: "center", padding: "20px" }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ backgroundColor: index % 2 ? "#f5f5f5" : "white" }}
                >
                  <TableCell sx={cellStyle}>
                    {formatThousandSeparator(row.event_point_min_weight)}
                  </TableCell>
                  <TableCell sx={cellStyle}>
                    {formatThousandSeparator(row.event_point_max_weight)}
                  </TableCell>
                  <TableCell sx={cellStyle}>
                    {formatThousandSeparator(row.event_point_sum_point)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const GameAngkaKembar = ({ data }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        padding: "16px",
      }}
    >
      <Text variant="h4" sx={{ fontWeight: 600, marginBottom: "16px" }}>
        Game Angka Kembar
      </Text>

      <Grid2
        container
        spacing={{ xs: 2 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{}}
      >
        {data.map((item, index) => (
          <Grid2
            key={index}
            size={{ xs: 2, sm: 4, md: 6 }}
            sx={{
              border: "1px solid gray",
              padding: "16px",
              borderRadius: "16px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text variant="h6">{item.game_code}</Text>
              <Box sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                <Text>Point:</Text>
                <Text sx={{ fontWeight: 600 }}>{item.game_point}</Text>
              </Box>
            </Box>
            <Text variant="body2">{item.game_name}</Text>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

// **Styles for headers and cells**
const headerStyle = {
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "20px",
};

const cellStyle = {
  textAlign: "center",
  fontSize: "20px",
  padding: "12px",
};
