import { IconButton, SvgIcon } from "@mui/material";
import Button from "@mui/material/Button";

const BasicButton = ({ children, sx, ...props }) => {
  return (
    <Button
      sx={{
        backgroundColor: "transparent",
        border: "none",
        color: "#111A29",
        padding: 0,
        textTransform: "none",

        // ":hover": {
        //   bgcolor: "primary.main",
        //   color: "white",
        // },
        // "&:focus": {
        //   border: "none",
        //   outline: "none",
        // },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

const ButtonLeftIcon = ({ sx, ...props }) => {
  return (
    <IconButton
      color="black"
      aria-label="open drawer"
      edge="start"
      sx={{
        width: "21px",
        height: "21px",
        border: "1px solid #C6CCD6",
        borderRadius: "4px",
        ...sx,
      }}
      {...props}
    >
      <SvgIcon
        sx={{
          display: "flex",
          justifyItems: "center",
          alignItems: "center",
          width: "10px",
          height: "auto",
        }}
      >
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.2734 0.853516L7.15606 3.97094L10.2734 7.08832"
            stroke="#111A29"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.8418 0.853516L1.72442 3.97094L4.8418 7.08832"
            stroke="#111A29"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </SvgIcon>
    </IconButton>
  );
};

export { BasicButton, ButtonLeftIcon };
