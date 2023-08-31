import { styled } from "@mui/material/styles";

import { Grid } from "@mui/material";

// Custom Grid styled component with theme for header
export const StyledGrid = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "varaint",
})(() => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "16px 32px !important",
  ":empty": {
    display: "none",
  },
}));
