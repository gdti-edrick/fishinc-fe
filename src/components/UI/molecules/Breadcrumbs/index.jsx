import { useLocation, Link as RouterLink } from "react-router-dom";
import { formatStringUppercase } from "../../../../utils/utils/formatString";
import { Breadcrumbs, Link } from "@mui/material";
import { Text } from "../../atoms/Typography";

function BasicBreadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    // <div role="presentation">
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        display: "flex",
      }}
    >
      {pathSegments.map((segment, index) => {
        const to = `/${pathSegments.slice(0, index + 1).join("/")}`;
        return (
          <Link
            key={index}
            component={RouterLink}
            to={to}
            underline="hover"
            color="inherit"
            sx={{
              transition: "color 0.3s, text-shadow 0.3s",
              "&:hover": {
                color: "#FDB614",
                textShadow: "0 0 2px rgba(253, 182, 20, 0.7)",
              },
            }}
          >
            <Text
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "12px",
                  md: "14px",
                },
              }}
            >
              {formatStringUppercase(segment)}
            </Text>
          </Link>
        );
      })}
    </Breadcrumbs>
    // </div>
  );
}

export default BasicBreadcrumbs;
