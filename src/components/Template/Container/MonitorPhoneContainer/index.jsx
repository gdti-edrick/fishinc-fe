import { Box } from "@mui/material";
import LogoImg from "../../../../assets/images/logo.png";

const MonitorPhoneContainer = ({ children }) => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('auth_background.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Box
        sx={{
          display: { xs: "block", sm: "none", md: "none" },
          position: "absolute",
          height: "100%",
          width: "100%",
          opacity: 0.9,
        }}
      >
        {" "}
        <Box
          component="img"
          alt="cover test"
          src={LogoImg} // mobile view
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            left: 0,
            bottom: 0,
            margin: "auto",
            width: "75%",
            height: "auto",
            maxWidth: "668px",
            maxHeight: "668px",
            minWidth: "276px",
            minHeight: "276px",
          }}
        />
      </Box>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 100,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { sm: "20px", md: "16px" },
            // width: { sm: 472, md: 472 },
            backgroundColor: { xs: "white", md: "transparent" },
            opacity: { xs: 0.8, md: 1 },
            padding: { xs: "16px", md: 0 },
            // margin: { xs: "16px", sm: "64px", md: "128px" },
            // borderRadius: "8px",
          }}
        >
          {children}
        </Box>
      </div>
    </Box>
  );
};

export default MonitorPhoneContainer;
