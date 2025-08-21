import React from "react";
import { Box } from "@mui/material";

import { BasicButton } from "components/UI/atoms/BasicButton";
import { Text } from "components/UI/atoms/Typography";
import useMadelineApp from "hooks/useMadelineApp";

const SubLayout = ({ children }) => {
  const { activeSubLayout } = useMadelineApp();

  if (activeSubLayout === "none") return children;

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        minWidth: 0,
      }}
    >
      <Box
        sx={{ flexGrow: 1 }}
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            width: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "100%",
                md: "21%",
              },
              backgroundColor: { xs: "#EBEEF0", sm: "#EBEEF0", md: "white" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "row", md: "column" },
                padding: {
                  xs: "12px 16px 12px 40px",
                  sm: "12px 16px",
                  md: "105px 32px",
                },
                gap: "32px",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <BasicButton
                onClick={() => console.log("transaction")}
                style={{ color: "#323A46", textAlign: "left" }}
              >
                <Text
                  variant="body1"
                  sx={[
                    { fontWeight: 700 },
                    {
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      textAlign: { xs: "center", sm: "left" },
                    },
                  ]}
                >
                  Transaction
                </Text>
              </BasicButton>
              <BasicButton
                onClick={() => console.log("history")}
                style={{ color: "#323A46", textAlign: "left", minWidth: 0 }}
              >
                <Text
                  variant="body1"
                  sx={[
                    { fontWeight: 700 },
                    {
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      textAlign: { xs: "center", sm: "left" },
                    },
                  ]}
                >
                  History
                </Text>
              </BasicButton>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: {
                xs: "100%",
                sm: "100%",
                md: "79%",
              },
              height: { xs: "100%", md: "auto" },
              backgroundColor: {
                xs: "white",
                sm: "white",
                md: "transparent",
              },
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: { xs: "8px", sm: "16px", md: "32px" },
                gap: "32px",
                alignItems: "flex-start",
                width: "100%",
                overflowX: "hidden",
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default SubLayout;
