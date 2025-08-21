import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, darken, Drawer, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Topbar from "../Topbar";
import styled from "@emotion/styled";

import LogoutModal from "../../Modal/CustomModal/AuthModal/LogoutModal";
import {
  drawerWidth,
  drawerWidthMinimize,
} from "../../../../../utils/utils/constant";
import { BasicButton } from "../../../atoms/BasicButton";
import {
  sedebarMenuItemBottom,
  sidebarMenuItems,
} from "../../../../../utils/utils/pathList";
import { Text } from "../../../atoms/Typography";

import { ReactSVG } from "react-svg";
import useWindowSize from "../../../../../hooks/useWindowSize";
import LogoIcon from "../../../molecules/LogoIcon";
import useAppContext from "../../../../../hooks/useAppContext";
import { getLocalStorageCRUD } from "../../../../../utils/utils/getLocalStorage";

const CustomMenuItem = styled(Box)(({ active, navShow }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  cursor: "pointer",
  transition: "ease-in-out 300ms",
  ":hover": {
    color: active ? "#FFFFFF" : "#202224",

    background: active ? darken("#FDB614", 0.3) : "rgba(255, 232, 178, 0.66)",
  },
  borderRadius: "6px",

  color: active ? "#FFFFFF" : "#202224",
  background: active ? "#FDB614" : "white",
  // borderLeft: active && "7px solid #001B33",
  // marginLeft: active && "-7px",
  boxSizing: active && "border-box",

  img: {
    filter:
      active &&
      "invert(43%) sepia(67%) saturate(4571%) hue-rotate(193deg) brightness(100%) contrast(111%)",
  },

  // MEDIA QUERY

  "@media screen and (max-width: 600px)": {
    marginBottom: "0px",
    padding: "8px 18px",
    gap: "8px",
  },

  "@media screen and (min-width: 601px) and (max-width: 900px)": {
    marginBottom: "12px",
    padding: "10px 21px",
    gap: "10px",
  },

  "@media screen and (min-width: 901px) ": {
    marginBottom: "24px",
    padding: "12px 24px 12px 16px",
    gap: "12px",
    minWidth: "227px",
  },
}));

export default function LayoutDrawer() {
  const { width } = useWindowSize();
  const { navShow, setNavShow } = useAppContext();

  const [pageNav, setPageNav] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    // setMobileOpen(width < 900 && !mobileOpen);
    setNavShow(!navShow);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar
        drawerTrigger={handleDrawerToggle}
        isActive={true}
        pageNav={pageNav}
      />
      <Box
        component="nav"
        sx={{
          width: { sm: navShow ? drawerWidth : drawerWidthMinimize },
          flexShrink: { sm: 0 },
          opacity: 1,
        }}
        aria-label="mailbox folders"
      >
        {/* <Drawer
          variant="temporary" // MOBILE
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: { xs: 190, sm: 240, md: drawerWidth },
            },
          }}
        >
          <MainDrawer
            setPageNav={(item) => setPageNav(item)}
            drawerTrigger={handleDrawerToggle}
          />
        </Drawer> */}
        <Drawer
          variant="permanent" // WEB
          sx={{
            display: { xs: "none", sm: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: navShow ? drawerWidth : drawerWidthMinimize,
              // width: "300px",
              background: "white",
              paddingLeft: navShow ? "0px" : "40px",
              transition: "ease-in-out 300ms",
              overflowX: "hidden",
            },
          }}
          open={false}
        >
          <MainDrawer
            setPageNav={(item) => setPageNav(item)}
            drawerTrigger={handleDrawerToggle}
          />
        </Drawer>
      </Box>
    </Box>
  );
}

const MainDrawer = ({ setPageNav, drawerTrigger }) => {
  const navigate = useNavigate();
  let location = useLocation();

  const [prevList, setPrevList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const prevList = JSON.parse(localStorage.getItem("prevList"));
    setPrevList(prevList ?? []);
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setModalData(null);
  };

  const handleModal = (item) => {
    switch (item.type) {
      case "confirm":
        navigate("/logout");
        break;
      case "cancel":
        closeModal();
        break;

      default:
        break;
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        minHeight: "100vh",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            boxSizing: "border-box",
            // justifyContent: { sm: "space-between", md: "center" },
            justifyContent: "flex-start",
            padding: { md: "8px 16px" },
          }}
        >
          <BasicButton
            onClick={() => navigate("/home")}
            sx={{
              minWidth: "267px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <LogoIcon isWhite={false} sx={{ minWidth: "223px" }} />
          </BasicButton>
          <BasicButton
            // onClick={() => drawerTrigger()}
            onClick={drawerTrigger}
            sx={{
              display: { xs: "flex", md: "none" },
              minWidth: 0,
              position: "absolute",
              right: "16px",
              width: "24px",
              hight: "24px",
              backgroundColor: "#EBEEF0",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
            >
              <path
                d="M21.9336 7.79297H3.93359C3.52359 7.79297 3.18359 7.45297 3.18359 7.04297C3.18359 6.63297 3.52359 6.29297 3.93359 6.29297H21.9336C22.3436 6.29297 22.6836 6.63297 22.6836 7.04297C22.6836 7.45297 22.3436 7.79297 21.9336 7.79297Z"
                fill="#0085FF"
              />
              <path
                d="M18.9336 12.793H6.93359C6.52359 12.793 6.18359 12.453 6.18359 12.043C6.18359 11.633 6.52359 11.293 6.93359 11.293H18.9336C19.3436 11.293 19.6836 11.633 19.6836 12.043C19.6836 12.453 19.3436 12.793 18.9336 12.793Z"
                fill="#0085FF"
              />
              <path
                d="M14.9336 17.793H10.9336C10.5236 17.793 10.1836 17.453 10.1836 17.043C10.1836 16.633 10.5236 16.293 10.9336 16.293H14.9336C15.3436 16.293 15.6836 16.633 15.6836 17.043C15.6836 17.453 15.3436 17.793 14.9336 17.793Z"
                fill="#0085FF"
              />
            </svg>
          </BasicButton>
        </Box>
        <Box sx={{ padding: "16px 16px 0px 16px", background: "white" }}>
          {sidebarMenuItems.map((item, index) => {
            const isActive = item.path === location.pathname;

            const crud = getLocalStorageCRUD();

            const permissions =
              crud?.admin_crud.filter(
                (itemFilter) => itemFilter.entity_code === item.entity_code
              ) || [];

            if (permissions[0]?.admin_crud_permission_r === 0) {
              return;
            }

            return (
              <CustomMenuItem
                key={index}
                onClick={() => {
                  navigate(item.path);
                }}
                active={isActive ? 1 : 0}
              >
                <ImageSvg
                  src={item.icon}
                  active={isActive}
                  style={{ width: "20px", height: "20px" }}
                />

                <Text variant="body" sx={{ textAlign: "left" }}>
                  {item.title}
                </Text>
              </CustomMenuItem>
            );
          })}
        </Box>
      </div>

      <Box>
        <Box
          sx={{
            p: 2,
            background: "white",
          }}
        >
          {sedebarMenuItemBottom.map((item, index) => {
            const activeSidebar = item.children.includes(location.pathname);
            // if (prevList.includes(item.path)) {
            if (item.path === "/logout") {
              return (
                <CustomMenuItem
                  key={index}
                  onClick={() => {
                    if (item.path === "/logout") {
                      setModalVisible(true);
                      setModalType("logout");
                      setModalData(null);
                    }
                    // setPageNav(item);
                  }}
                  active={activeSidebar ? 1 : 0}
                >
                  <Box
                    component={"img"}
                    sx={{ width: "20px" }}
                    src={item.icon}
                  />
                  <Typography variant="body1">{item.title}</Typography>
                </CustomMenuItem>
              );
            } else if (item.path === "/help") {
              return (
                <CustomMenuItem
                  key={index}
                  onClick={() => {
                    const url =
                      "https://sites.google.com/view/manualbookfishinc/halaman-muka#h.rybgfm2kkcx2";
                    window.open(url, "_blank");
                  }}
                  active={activeSidebar ? 1 : 0}
                >
                  <Box
                    component={"img"}
                    sx={{ width: "20px" }}
                    src={item.icon}
                  />
                  <Typography variant="body1">{item.title}</Typography>
                </CustomMenuItem>
              );
            } else {
              return (
                <CustomMenuItem
                  key={index}
                  to={item.path}
                  onClick={() => {
                    navigate(item.path);
                    // if (item.path === "/logout") {
                    //   setModalVisible(true);
                    //   setModalType("logout");
                    //   setModalData(null);
                    // }
                    // setPageNav(item);
                  }}
                  active={activeSidebar ? 1 : 0}
                >
                  <Box
                    component={"img"}
                    sx={{ width: "20px" }}
                    src={item.icon}
                  />
                  <Typography variant="body1">{item.title}</Typography>
                </CustomMenuItem>
              );
            }
            // }
          })}
        </Box>
      </Box>
      <LogoutModal
        modalVisible={modalVisible}
        modalClosed={() => closeModal()}
        modalType={modalType}
        modalData={modalData}
        action={(item) => handleModal(item)}
      />
    </div>
  );
};

const ImageSvg = ({ active, ...props }) => {
  return (
    <ReactSVG
      beforeInjection={(svg) => {
        svg.setAttribute("style", `width: 16px`, `height: 16px`);
        svg.querySelectorAll("path").forEach((path) => {
          // path.setAttribute("stroke", active ? "#FFFFFF" : "#111A29");
          path.setAttribute("fill", active ? "#FFFFFF" : "#111A29");
        });
      }}
      {...props}
    />
  );
};
