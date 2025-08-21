import { CircularProgress, Stack } from "@mui/material";
import { BasicButton } from "../../atoms/BasicButton";
import { Text } from "../../atoms/Typography";

const SubmitButton = ({
  children = null,
  title = "Submit",
  fullWidth = false,
  isLoaded = false,
  style,
  sx,
  textStyle,
  ...props
}) => {
  return (
    <BasicButton
      fullWidth={fullWidth}
      disabed={isLoaded}
      style={{
        backgroundColor: isLoaded ? "transparent" : "#0085FF",
        cursor: isLoaded ? "not-allowed" : "pointer",
        borderRadius: "6px",
        color: "#FFFFFF",
        ...style,
      }}
      sx={{
        padding: "12px 8px",
        ...sx,
      }}
      {...props}
    >
      <Stack direction={"row"} alignItems={"center"}>
        {isLoaded ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Text sx={{ ...textStyle }}>
            {children !== null ? children : title}
          </Text>
        )}
      </Stack>
    </BasicButton>
  );
};

export { SubmitButton };
