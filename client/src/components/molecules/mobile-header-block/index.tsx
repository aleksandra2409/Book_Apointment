import { FC } from "react";

import { Grid } from "@mui/material";

import { StyledGrid } from "./mobile-header-block.style";

interface MobileHeaderBlockProps {
  leftSlot?: JSX.Element[];
  rightSlot?: JSX.Element[];
}

export const MobileHeaderBlock: FC<MobileHeaderBlockProps> = ({
  leftSlot,
  rightSlot,
}) => {
  return (
    <Grid
      container
      spacing={1}
      sx={{
        borderBottom: "1px solid #D7E1E4",
        margin: "0",
        padding: "0 20%",
        "@media (min-width: 769px)": {
          display: "none",
        },
      }}
    >
      <StyledGrid xs item justifyContent="start">
        {leftSlot}
      </StyledGrid>
      <StyledGrid xs item justifyContent="end">
        {rightSlot}
      </StyledGrid>
    </Grid>
  );
};
