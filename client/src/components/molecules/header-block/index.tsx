import { FC } from "react";

import { Grid } from "@mui/material";

import { StyledGrid } from './header-block.style';

interface HeaderBlockProps {
  leftSlot?: JSX.Element[];
  centerSlot?: JSX.Element[];
  rightSlot?: JSX.Element[];
}

export const HeaderBlock: FC<HeaderBlockProps> = ({
  leftSlot,
  centerSlot,
  rightSlot,
}) => {
  return (
    <Grid
      container
      spacing={1}
      sx={{
        borderBottom: "1px solid #D7E1E4",
        margin: "0",
        "@media (max-width: 768px)": {
          display: "none",
        },
      }}
    >
      <StyledGrid xs item justifyContent="start">
        {leftSlot}
      </StyledGrid>
      <StyledGrid xs item justifyContent="center">
        {centerSlot}
      </StyledGrid>
      <StyledGrid xs item justifyContent="end">
        {rightSlot}
      </StyledGrid>
    </Grid>
  );
};
