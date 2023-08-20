import { styled } from "@mui/material/styles";

import { Grid } from "@mui/material";

// Custom container styled component with theme for grid container
export const StyledGrid = styled(Grid)(() => ({
  backgroundColor: "#F2F7F7",
  padding: "32px",
  minHeight: "100vh",
  flexDirection: "row",
  gap: "32px",
  alignContent: "flex-start",
  "@media (max-width: 768px)": {
    justifyContent: "center",
  },
}));
