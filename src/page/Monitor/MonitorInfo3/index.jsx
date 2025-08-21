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

import CoinIcon from "../../../assets/icons/dashboard/coin.svg";

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_SOCKET;

function MonitorInfo3() {
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

  const bonusGame = useMemo(() => {
    const top = dataMonitorInfo?.data?.game_top || [];
    const angkaKembar = dataMonitorInfo?.data?.game_angka_kembar || [];
    return [...top, ...angkaKembar];
  }, [dataMonitorInfo]);

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
        flexDirection: "row",
        width: "100vw",
        height: "100vh",
        gap: "8px",
        boxSizing: "border-box",
        backgroundColor: "orange",

        backgroundImage: "url('monitor_info_bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Left Section */}

      <Box sx={{ width: "62%" }}>
        <Box
          sx={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "0px",
          }}
        >
          <Box>
            {/* Event Point Table */}
            <Grid2
              container
              spacing={{ xs: "12px", sm: "14px", md: "20px" }}
              columns={{ xs: 20, sm: 20, md: 20 }}
              sx={{ marginTop: "0px" }}
            >
              <Grid2
                size={{ xs: 8, sm: 8, md: 8 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  color: "#000000",
                }}
              >
                <Text
                  sx={{
                    // fontSize: "66px",
                    fontSize: "76px",
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  WEIGHT{" "}
                  <span style={{ fontSize: "40px", fontWeight: 500 }}>
                    (GRM)
                  </span>
                </Text>
                <Text
                  sx={{
                    // fontSize: "66px",
                    fontSize: "76px",
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  POINT TABLE
                </Text>
              </Grid2>
              {infoPoint.map((item, index) => (
                <Grid2
                  key={index}
                  size={{ xs: 4, sm: 4, md: 4 }}
                  sx={{
                    overflow: "hidden",
                    // marginTop: "20px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "8px",
                      justifyContent: "center",
                      padding: "20px 0px",
                      backgroundColor: "#000000",
                      borderRadius: "12px",
                      // marginBottom: "2px",
                    }}
                  >
                    <Text
                      // variant={"h5"}
                      sx={{
                        fontSize: "36px",
                        fontWeight: 900,
                        color: "#F4B014",
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {formatThousandSeparator(item.event_point_min_weight)}-
                      {formatThousandSeparator(item.event_point_max_weight)}
                    </Text>
                    {/* <Text
                    sx={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#F4B014",
                      fontFamily: "'Montserrat', sans-serif",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    GRM
                  </Text> */}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "4px",
                      padding: "16px 20px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "2px solid #000000",
                    }}
                  >
                    <Box
                      component="img"
                      src={CoinIcon}
                      alt="coin"
                      sx={{ width: "50px", aspectRatio: "1/1" }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "4px",
                      }}
                    >
                      <Text
                        variant={"h4"}
                        sx={{
                          fontWeight: 900,
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {formatThousandSeparator(item.event_point_sum_point)}
                      </Text>
                      <Text
                        variant={"h6"}
                        sx={{
                          fontWeight: 900,
                          fontFamily: "'Montserrat', sans-serif",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        PTS
                      </Text>
                    </Box>
                  </Box>
                </Grid2>
              ))}
            </Grid2>

            <Text
              variant="h6"
              sx={{ fontWeight: 600, color: "#595959", marginTop: "8px" }}
            >
              *Berat diluar tabel tidak mendapatkan point
            </Text>
          </Box>

          {/* Game Angka Kembar */}

          <Box>
            <Text
              sx={{
                fontSize: "70px",
                fontWeight: 900,
                marginBottom: "16px",
                color: "#000000",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              Bonus Game
            </Text>

            <Grid2
              container
              spacing={{ xs: "20px", sm: "40px", md: "40px" }}
              columns={{ xs: 12, sm: 12, md: 12 }}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* {gameAngkaKembar.map((item, index) => (
                <Grid2
                  key={index}
                  size={{ xs: 4, sm: 4, md: 4 }}
                  sx={{
                    border: "1px solid gray",
                    padding: "30px",
                    borderRadius: "40px",
                    backgroundColor: "#FFFFFF",
                    minWidth: "500px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <Text variant="h3" sx={{ fontWeight: 700, width: "70%" }}>
                      {item.game_code}
                    </Text>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: "-50px",
                        right: "-50px",
                        border: "6px solid #FDB614",
                        borderRadius: "300px",
                        // padding: "16px",
                        minWidth: "140px",
                        aspectRatio: "1/1",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <Text
                          sx={{
                            fontWeight: 900,
                            fontSize: "36px",
                            color: "#FDB614",
                          }}
                        >
                          {formatThousandSeparator(item.game_point)}
                        </Text>
                        <Text
                          sx={{
                            position: "absolute",
                            bottom: "-24px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontWeight: 400,
                            fontSize: "24px",
                            color: "#000000",
                            textAlign: "center",
                          }}
                        >
                          Points
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  <Text
                    variant="h3"
                    sx={{ textAlign: "left", marginTop: "16px" }}
                  >
                    {item.game_name}
                  </Text>
                </Grid2>
              ))} */}

              {bonusGame.map((item, index) => (
                <Grid2
                  key={index}
                  size={{ xs: 4, sm: 4, md: 4 }}
                  sx={{
                    border: "1px solid gray",
                    padding: "20px",
                    borderRadius: "40px",
                    backgroundColor: "#FFFFFF",
                    // minWidth: "500px",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <Text
                      sx={{ fontSize: "30px", fontWeight: 900, width: "100%" }}
                    >
                      {item.game_code}
                    </Text>
                  </Box>
                  <Text
                    sx={{
                      fontSize: "26px",
                      textAlign: "left",
                      marginTop: "16px",
                      width: "64%",
                    }}
                  >
                    {item.game_name}
                  </Text>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      bottom: "-50px",
                      right: "-20px",
                      border: "6px solid #FDB614",
                      borderRadius: "300px",
                      // padding: "16px",
                      minWidth: "160px",
                      aspectRatio: "1/1",
                      backgroundColor: "#000000",
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Text
                        sx={{
                          fontWeight: 900,
                          fontSize: "36px",
                          color: "#FDB614",
                        }}
                      >
                        {formatThousandSeparator(item.game_point)}
                      </Text>
                      <Text
                        sx={{
                          position: "absolute",
                          bottom: "-24px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontWeight: 400,
                          fontSize: "24px",
                          color: "#FFFFFF",
                          textAlign: "center",
                        }}
                      >
                        Points
                      </Text>
                    </Box>
                  </Box>
                </Grid2>
              ))}

              <Box sx={{ width: "100%" }}>
                <Text
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#595959",
                    marginTop: "20px",
                  }}
                >
                  *TOP BIG/SMALL hanya berlaku jika ada min. 5 peserta di sesi
                  dan menempati peringkat 1 pada leaderboard masing-masing.
                </Text>
              </Box>
            </Grid2>
          </Box>
        </Box>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          width: "38%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // backgroundColor: "red",
          // gap: "8px", // Adds spacing between top and bottom sections
        }}
      >
        {/* Booking Section */}
        <Box
          sx={{
            padding: "40px 0px 0px 100px",
            // backgroundColor: "red",
          }}
        >
          <Text
            variant="h2"
            sx={{
              // fontSize: "48px",
              fontWeight: 700,
              color: "#FDB614",
              padding: "0px 0px 0px 100px",
              // textAlign: "center",
            }}
          >
            Tata Cara Permainan:
          </Text>
          <Box
            component="ol"
            sx={{
              pl: "30px",
              fontSize: "28px",
              lineHeight: 1.4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: "#FFFFFF",
              margin: "0px",
              padding: "0px 40px 0px 140px",
            }}
          >
            <li>
              Daftar dan lakukan pembayaran melalui kasir, Anda WAJIB mengunakan
              nomor HP aktif untuk validasi redeem poin kemudian. 1 nomor HP
              bisa untuk beberapa ID pemancing.
            </li>
            <li>
              Anda akan diberikan gelang RFID untuk penyimpanan data permainan
              dan poin, satu set pancingan, umpan dan kain lap.
            </li>
            <li>
              Ikan yang dipancing untuk ditimbang di timbangan yang disediakan,
              letakan ikan dan tunggu sampai angka berhenti.{" "}
            </li>
            <li>
              TAP gelang RFID Anda pada area yang ditentukan untuk mendapatkan
              POIN permainan secara otomatis sesuai dengan ketentuan POIN yang
              tersedia.
            </li>
            <li>
              ⁠Anda dapat menyelesaikan permainan dan menukarkan POIN dengan
              hadiah dan makanan/minuman yang tersedia.
            </li>
          </Box>
        </Box>

        {/* Point Section */}
        <Box sx={{ padding: "0px 0px 40px 200px" }}>
          <Text
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#FDB614",
              // textAlign: "center",
            }}
          >
            NOTES
          </Text>
          <Box
            component="ul"
            sx={{
              fontSize: "30px",
              lineHeight: 1.4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: "#FFFFFF",
              padding: "0px 40px 0px 40px",
              margin: "0px",
            }}
          >
            <li>
              Berat ikan tidak dapat digabungkan dan TIDAK semua ikan memiliki
              nilai POIN permainan.
            </li>
            <li>
              POIN dapat disimpan untuk ditukar kemudian hari namun tidak dapat
              digabungkan antar ID.
            </li>
            <li>
              Pihak Fish.inc berhak membatalkan Poin jika ditemukan adanya
              kecurangan.
            </li>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MonitorInfo3;
