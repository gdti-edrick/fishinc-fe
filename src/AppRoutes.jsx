import React from "react";
import { Backdrop, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { router } from "./router";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const AppRoutes = () => {
  const loaderFetching = useSelector((state) => state.common.loaderFetching);

  const appRoutes = createBrowserRouter(router);

  return (
    <React.Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loaderFetching}
      >
        <Stack direction={"column"} spacing={1}>
          {/* <Player
            src={require("./@madeline/lottie/loader_backdrop.json")}
            className="player"
            loop={true}
            autoplay
            style={{ height: 50, width: 50 }}
          /> */}
          &nbsp;Loading...
        </Stack>
      </Backdrop>
      {/* {appRoutes} */}
      <RouterProvider router={appRoutes} />
    </React.Fragment>
  );
};

export default AppRoutes;
