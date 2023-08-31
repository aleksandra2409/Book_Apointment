import { FC } from "react";

import {
  Typography,
  CardActions,
  CardContent,
  Button,
  Box,
} from "@mui/material";

import { StyledCard } from "./service.style";

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service | null) => void;
}

export const ServiceCard: FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <StyledCard>
      <CardContent>
        <Typography
          sx={{ fontSize: 20, fontWeight: "700" }}
          color="primary.main"
          gutterBottom
        >
          {service.serviceName}
        </Typography>
        <Typography sx={{ mb: 3, fontStyle: "italic" }} color="secondary.main">
          {service.category}
        </Typography>
        <Typography sx={{ mb: 3 }} color="secondary.main">
          {service.duration.toString()} min
        </Typography>
        <Box
          sx={{ display: "flex", flexDirection: "row", gap: "4px" }}
          color="secondary.main"
        >
          {service.availability.map((slot: string, index: number) => (
            <Typography
              sx={{ mb: 3, fontWeight: "500" }}
              color="secondary.main"
              key={slot + index}
            >
              {slot}
            </Typography>
          ))}
        </Box>
        <Typography sx={{ mb: 3 }} color="secondary.main">
          {service.price.toString()} din
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => onClick(service)} size="small">
          Reserve Appointment
        </Button>
      </CardActions>
    </StyledCard>
  );
};
