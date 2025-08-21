import { Button, Grid2, Box } from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

const Numpad = ({ onClick }) => {
  const handleClick = (value) => {
    if (onClick) onClick(value);
  };

  const keys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "backspace",
    "0",
    "enter",
  ];

  const renderKey = (key) => {
    if (key === "backspace") {
      return <BackspaceIcon />;
    }
    if (key === "enter") {
      return <KeyboardReturnIcon />;
    }
    return key;
  };

  return (
    <Box
      sx={{
        margin: "0",
        width: "300px",
        backgroundColor: "rgba(0, 0, 0, 0.30)",
        border: "1px solid #FFFFFF",
        padding: "34px",
        borderRadius: "20px",
      }}
    >
      <Grid2
        container
        spacing={{ xs: 1, md: 1 }}
        columns={{ xs: 12, sm: 12, md: 12 }}
      >
        {keys.map((key, index) => (
          <Grid2
            item
            size={{ xs: 2, sm: 4, md: 4 }}
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleClick(key)}
              sx={{
                width: "80px",
                aspectRatio: 1,
                borderRadius: "100px",
                backgroundColor: "white",
                border: "none",
                color: "#000000",
                fontSize: "24px",

                "&:active": {
                  backgroundColor: "#FDB614",
                },
              }}
            >
              {renderKey(key)}
            </Button>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Numpad;
