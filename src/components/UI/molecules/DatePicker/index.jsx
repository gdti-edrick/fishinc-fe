import { Box, Button, Menu, Tooltip } from "@mui/material";

import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { Text } from "../../atoms/Typography";
import { BasicButton } from "../../atoms/BasicButton";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

export const CustomDatePicker = ({
  selectedDate,
  setSelectedDate,
  tooltipTitle,
}) => {
  const [tempDate, setTempDate] = useState(selectedDate); // Temp date also starts with selectedDate
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCancel = () => {
    // setSelectedDate(null); // Reset the date selection
    // setTempDate(null); // Reset the date temp
    setAnchorElUser(null);
  };

  const handleChooseDate = () => {
    setSelectedDate(tempDate); // Set the selected date
    handleCloseUserMenu();
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Tooltip title={tooltipTitle}>
        <Button
          onClick={handleOpenUserMenu}
          sx={{
            borderRadius: "12px",
            width: { xs: "100px", sm: "120px", md: "140px" },
            height: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#231F20",
            border: "1px solid #BDBDBD",

            ":hover": {
              border: "1px solid #707070",
              color: "#231F20",
              transition: "0.3s",
            },
          }}
        >
          <Text sx={{ fontSize: { xs: "14px" } }}>
            {format(selectedDate, "dd MMM yyyy")}
          </Text>
        </Button>
      </Tooltip>
      <Menu
        sx={{
          mt: "48px",
          "& .MuiList-root": {
            padding: "20px",
            borderRadius: "16px",
          },
          "& .MuiPopover-paper": {
            borderRadius: "22px",
            border: "1px solid #FDB614",
          },
        }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <DatePicker
          selected={tempDate}
          onChange={(date) => setTempDate(date)}
          // minDate={new Date()} // Disable yesterday and past dates
          // maxDate={maxDate}
          inline
          calendarClassName="custom-calendar" // Custom class for calendar
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              borderColor: "#9B9597",
              color: "#9B9597",
              borderRadius: "8px",
              width: "45%",
              ":hover": {
                borderColor: "#9B9597",
                backgroundColor: "#f4f4f4",
              },
            }}
          >
            <Text sx={{ fontSize: "10px", fontWeight: 600 }}>Cancel</Text>
          </Button>
          <Button
            variant="contained"
            onClick={handleChooseDate}
            sx={{
              backgroundColor: "#FDB614",
              color: "white",
              borderRadius: "8px",
              width: "45%",
              ":hover": {
                backgroundColor: "#e5a511",
              },
            }}
          >
            <Text sx={{ fontSize: "10px", fontWeight: 600 }}>Choose Date</Text>
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};
