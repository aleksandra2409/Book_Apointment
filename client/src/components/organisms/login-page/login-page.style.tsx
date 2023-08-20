import { styled } from "@mui/material/styles";

import { Container } from "@mui/material";

export const StyledContainer = styled(Container)(() => ({
  padding: "32px 16px !important",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  minWidth: "400px",
}));
