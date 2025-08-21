import { Box } from "@mui/material";
import FishIncLogo from "../../../../assets/icons/FishInc_logo.png";
import FishIncLogoBlack from "../../../../assets/icons/FishInc_logo_black.png";

const LogoIcon = ({ isWhite = true, sx }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        alt="cover test"
        src={isWhite ? FishIncLogo : FishIncLogoBlack}
        sx={{ width: "100%", ...sx }}
      />
    </Box>
  );
};

export default LogoIcon;
