import { styled } from "@mui/material/styles";

// Custom container styled component with theme for mobile button
export const StyledContainer = styled("div")(() => ({
  padding: "0px",
  width: "100%",
  position: "fixed",
  bottom: 0,
  left: 0,
  "@media (min-width: 769px)": {
    display: "none",
  },
}));
