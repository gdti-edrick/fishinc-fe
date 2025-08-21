import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

import { Typography } from "@mui/material";

const Text = ({ variant, children, ...props }) => {
  let theme = createTheme({
    typography: {
      fontFamily: "Poppins, Raleway, Arial",
      sidebar: {
        fontSize: "12px",
      },
      color: "#000000",
    },
  });
  theme = responsiveFontSizes(theme);
  return (
    <ThemeProvider theme={theme}>
      <Typography variant={variant} {...props}>
        {children}
      </Typography>
    </ThemeProvider>
  );
};

export { Text };
