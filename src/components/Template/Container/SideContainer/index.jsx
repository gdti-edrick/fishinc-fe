import { Box } from "@mui/material";

const SideContainer = ({ sx, children }) => {
  return (
    <Box
      sx={{
        // width: {
        //   xs: "100%",
        //   sm: "21%",
        // },
        // maxWidth: {
        //   xs: "100%",
        //   sm: "200px",
        // },
        backgroundColor: { xs: "#EBEEF0", sm: "white" },
        overflowY: "hidden",
        boxSizing: "border-box",
        borderRight: { xs: "0px solid #C6CCD6", sm: "1px solid #C6CCD6" },
        borderBottom: { xs: "1px solid #C6CCD6", sm: "0px solid #C6CCD6" },
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: { xs: "row", sm: "column", md: "column" },
          alignItems: { xs: "center", sm: "flex-start" },

          "&::-webkit-scrollbar": {
            width: "0px",
            height: "0px",
          },

          overflowY: "scroll",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SideContainer;
