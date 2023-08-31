import { styled } from "@mui/material/styles";

import { Grid } from "@mui/material";

// Custom container styled component with theme for grid container
export const StyledGrid = styled(Grid)(() => ({
  backgroundColor: "#F2F7F7",
  padding: "32px",
  minHeight: "calc(100vh - 200px)",
  flexDirection: "row",
  gap: "32px",
  alignContent: "flex-start",
  justifyContent: "center",
}));
