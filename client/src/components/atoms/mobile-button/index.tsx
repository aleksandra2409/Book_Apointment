import { FC } from "react";


import { Button } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { StyledContainer } from "./mobile-button.style";

interface MobileButtonProps {
  onClick?: () => void;
}

export const MobileButton: FC<MobileButtonProps> = ({ onClick }) => {
  return (
    <StyledContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        endIcon={<AddIcon />}
        sx={{ width: "100%", height: "56px", borderRadius: "0px" }}
      >
        Add Task
      </Button>
    </StyledContainer>
  );
};
