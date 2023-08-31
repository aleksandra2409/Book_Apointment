import { styled } from "@mui/material/styles";

import { Container } from "@mui/material";

export const StyledContainer = styled(Container)(() => ({
  padding: "32px 16px !important",
  borderBottom: "1px solid #D7E1E4",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  minWidth: "400px",
}));
