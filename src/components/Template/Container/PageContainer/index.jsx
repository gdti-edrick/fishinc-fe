import { Box } from "@mui/material";

const PageContainer = ({ isSubNav = false, children }) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        maxWidth: "100%",

        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          maxWidth: "100%",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isSubNav
              ? { xs: "column", sm: "row" }
              : { xs: "column", sm: "column" },
            width: "100%",
            maxWidth: "100%",
            position: "relative",
            // justifyContent: "center",
          }}
        >
          {children}
        </Box>
      </div>
    </div>
  );
};

export default PageContainer;
