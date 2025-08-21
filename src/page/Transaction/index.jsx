import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import AllTab from "./AllTab";
import IdrTab from "./IdrTab";
import PointTab from "./PointTab";

const Transaction = () => {
  const [tabValue, setTabValue] = React.useState("all");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTab = () => {
    switch (tabValue) {
      case "all":
        return <AllTab />;
      case "idr":
        return <IdrTab />;
      case "point":
        return <PointTab />;
      default:
        return null;
    }
  };
  return (
    <Box sx={{}}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          padding: "16px",
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
            value="all"
            label="All"
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
            value="idr"
            label="Idr"
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
            value="point"
            label="Point"
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

export default Transaction;
