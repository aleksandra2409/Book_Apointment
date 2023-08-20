import { FC } from "react";

import {
  Typography,
  CardActions,
  CardContent,
  Rating,
  Button,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

import { StyledCard } from "./sticky.style";

interface StickyProps {
  item: Todo;
  onClick: (edit: boolean, todo: Todo) => void;
}

export const Sticky: FC<StickyProps> = ({ item, onClick }) => {
  return (
    <StyledCard>
      <CardContent>
        <Typography sx={{ fontSize: 20 }} color="primary.main" gutterBottom>
          {item.title}
        </Typography>
        <Typography sx={{ mb: 3 }} color="secondary.main">
          {item.status}
        </Typography>
        <Typography variant="body2" color="secondary.main">
          Priority:
          <br />
          <Rating
            icon={<LocalFireDepartmentIcon />}
            emptyIcon={<LocalFireDepartmentIcon />}
            value={item.priority}
            readOnly
          />
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => onClick(true, item)} size="small">
          Edit
        </Button>
      </CardActions>
    </StyledCard>
  );
};
