import {
  Box,
  Toolbar,
  AppBar,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  drawerWidth,
  drawerWidthMinimize,
  toolbarHeight,
} from "../../../../../utils/utils/constant";
import BasicBreadcrumbs from "../../../molecules/Breadcrumbs";
import { BasicButton, ButtonLeftIcon } from "../../../atoms/BasicButton";
import { SearchInput } from "../../../molecules/CustomInput";
import { Text } from "../../../atoms/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DummyImg from "../../../../../assets/images/dashboard/DummyPic.png";
import { useEffect, useState } from "react";
import useAppContext from "../../../../../hooks/useAppContext";
import { getLocalStorageUser } from "../../../../../utils/utils/getLocalStorage";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import LogoutModal from "../../Modal/CustomModal/AuthModal/LogoutModal";
import { useNavigate } from "react-router-dom";

export default function DashboardToolbar({ drawerTrigger }) {
  const { navShow } = useAppContext();
  // const { admin_displayname } = getLocalStorageUser();
  const navigate = useNavigate();
  const dataLocal = getLocalStorageUser();
  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      const user = JSON.parse(data);
      setUserData((prev) => {
        return {
          ...prev,
          username: user.user_username,
          fullName: user.user_fullname,
        };
      });
    }
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleModal = (item) => {
    console.log("item action => ", item);
    switch (item.type) {
      case "confirm":
        navigate("/logout");
        break;
      case "cancel":
        closeModal();
        break;

      case "success_change_password":
        setModalVisible(true);
        setModalType("success_change_password");
        setModalData({
          title: "Success Change Password",
          subtitle:
            "Your password has been successfully changed. Enjoy your experience!",
        });
        break;

      default:
        break;
    }
  };

  const handleChangePassword = () => {
    setModalVisible(true);
    setModalType("change_password");
    setModalData(null);
  };

  return (
    <AppBar
      position="fixed"
      variant="dense"
      sx={{
        ml: { xs: `${navShow ? drawerWidth : drawerWidthMinimize}px` },
        boxShadow: 0,
        backgroundColor: "white",
        borderBottom: "1px solid #E0E0E0",
        height: `${toolbarHeight}px`,
        justifyContent: "center",
        padding: 0,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: "12px" }}>
          <ButtonLeftIcon
            onClick={drawerTrigger}
            sx={{
              ml: {
                xs: "0px",
                md: `${(navShow ? drawerWidth : drawerWidthMinimize) - 12}px`,
              },
              transform: navShow ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />

          <BasicBreadcrumbs />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Box
            sx={{
              width: "50px",
              height: "50px",
              borderRadius: "100%",
              backgroundColor: "#D8D8D8",
              marginRight: "16px",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              alt="picture profile"
              src={DummyImg}
              sx={{ width: "50px", height: "50px" }}
            />
          </Box>

          <Tooltip title="Account settings">
            <Button onClick={handleClick}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  width: { sx: "100px", md: "100px" },
                }}
              >
                <Text sx={{ color: "#404040", fontWeight: 700 }}>
                  {userData.username}
                </Text>
                {dataLocal?.admin_displayname && (
                  <Text sx={{ color: "#565656", fontWeight: 600 }}>
                    {dataLocal?.admin_displayname}
                  </Text>
                )}
              </Box>
            </Button>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* <MenuItem onClick={handleClose}>
              <Avatar /> Profile
            </MenuItem> */}
            <MenuItem onClick={handleChangePassword}>
              <Avatar /> Change Password
            </MenuItem>
            {/* <Divider /> */}
            {/* <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem> */}
            {/* <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem> */}
          </Menu>
        </Box>
      </Toolbar>

      <LogoutModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </AppBar>
  );
}
