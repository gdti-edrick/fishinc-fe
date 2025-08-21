import Box from "@mui/material/Box";
// import { GlobalStyles } from "@mui/material";

import useAppContext from "../../../hooks/useAppContext";
import {
  drawerWidth,
  drawerWidthMinimize,
  toolbarHeight,
} from "../../../utils/utils/constant";
import useWindowSize from "../../../hooks/useWindowSize";
import LayoutDrawer from "../../UI/organisms/Drawer/LayoutDrawer";

export default function Layout({ children }) {
  const webWindow = useWindowSize();
  const { height } = webWindow;
  const { activeLayout, navShow } = useAppContext();

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* <GlobalStyles styles={{ body: { backgroundColor: "black" } }} /> */}
      {activeLayout === "default" ? (
        <Box
          sx={{
            position: "relative",
            height: "100%",
            overflow: "scroll",
            backgroundColor: "#F7F9FB",
            scrollbarWidth: "none",
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              // backgroundColor: "blue",
              ml: { md: `${navShow ? drawerWidth : drawerWidthMinimize}px` },
              transition: "ease-in-out 300ms",
              paddingTop: `${toolbarHeight}px`,
              // backgroundColor: "red",
            }}
          >
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                height: `${height - toolbarHeight}px`,
              }}
            >
              <LayoutDrawer />
              {children}
            </Box>
          </Box>
        </Box>
      ) : null}

      {activeLayout === "solo-page" ? <Box>{children}</Box> : null}
    </Box>
  );
}
