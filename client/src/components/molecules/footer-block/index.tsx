import { FC } from "react";

import { Grid } from "@mui/material";

import { StyledGrid } from "./footer-block.style";

interface FooterBlockProps {
  leftSlot?: JSX.Element[];
  centerSlot?: JSX.Element[];
  rightSlot?: JSX.Element[];
}

export const FooterBlock: FC<FooterBlockProps> = ({
  leftSlot,
  centerSlot,
  rightSlot,
}) => {
  return (
    <Grid
      container
      spacing={1}
      sx={{
        borderTop: "1px solid #D7E1E4",
        margin: "0",
        "@media (max-width: 768px)": {
          display: "none",
        },
      }}
    >
      <StyledGrid xs item justifyContent="end">
        {leftSlot}
      </StyledGrid>
      <StyledGrid xs item justifyContent="center">
        {centerSlot}
      </StyledGrid>
      <StyledGrid xs item justifyContent="start" flexDirection={"column"}>
        {rightSlot}
      </StyledGrid>
    </Grid>
  );
};
