import { styled } from "@mui/material/styles";

import { Card } from "@mui/material";

// Custom Card styled component with theme for Todo item
export const StyledCard = styled(Card)(() => ({
  minWidth: 275,
  minHeight: 215,
  backgroundColor: "#FBF5EC",
  height: "fit-content",
}));
