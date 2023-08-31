// @ts-nocheck
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Dialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Typography,
  Button,
  Box,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { StyledContainer } from "./user-modal.style";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import enGB from "dayjs";
import dayjs from "dayjs";

interface UserModalProps {
  open: boolean;
  handleModalOpen: () => void;
}

interface UserReservation {
  userEmail: string;
  token: string;
  date: Date | null;
  timestamp: string;
}

export const UserModal: FC<UserModalProps> = ({ open, handleModalOpen }) => {
  const [reservationStep, setReservationStep] = useState<number>(0);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const { register, handleSubmit, control, reset, setValue, getValues } =
    useForm<UserReservation>();

  const onClose = () => {
    handleModalOpen();
    setReservationStep(0);
    setReservation(null);
    reset({
      userEmail: "",
      token: "",
      date: null,
      timestamp: "",
    });
  };

  const handleUserData = (e: any) => {
    e.preventDefault();
    getUserReservation();
  };

  const getUserReservation = () => {
    axios
      .get("http://localhost:5050/api/reservation", {
        params: {
          userEmail: getValues("userEmail"),
          token: getValues("token"),
        },
      })
      .then(function (response) {
        let res = response.data;
        setReservation(res);
        if (res === null) {
          alert("Resrvation not found");
          onClose();
        } else {
          setReservationStep(1);
        }
        console.log(res);
      })
      .catch(function (error) {
        alert(error);
        onClose();
      });
  };

  const handleNewReservationData = (e: any) => {
    e.preventDefault();
    setReservationStep(2);
  };

  const checkEarlyBird = () => {
    if (reservation !== null && getValues("date") !== null) {
      if (
        dayjs(getValues("date")).isBefore(dayjs(reservation.service?.earlyBird))
      ) {
        return true;
      }
    }
    return false;
  };

  const finishReservation = () => {
    updateReservation();
    onClose();
  };

  const updateReservation = () => {
    const date = dayjs(getValues("date"));

    // Assuming getValues("service.availability") returns a time string in the format "HH:mm"
    const time = getValues("timestamp");

    // Combine date and time
    const dateTimeString = `${date.format("YYYY-MM-DD")}T${time}`;

    const mergedDateTime = dayjs(dateTimeString);
    let body = {
      userEmail: getValues("userEmail"),
      token: getValues("token"),
      date: mergedDateTime,
      price: reservation?.service?.price * (checkEarlyBird() ? 0.95 : 1),
    };
    axios
      .put("http://localhost:5050/api/reservation", body)
      .then(function (response) {
        let res = response.data;
        alert(res.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const cancelReservation = () => {
    axios
      .delete("http://localhost:5050/api/reservation", {
        data: {
          userEmail: getValues("userEmail"),
          token: getValues("token"),
        },
      })
      .then(function (response) {
        let res = response.data;
        alert(res.message);
        onClose();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Container
        sx={{
          padding: "16px !important",
          borderBottom: "1px solid #D7E1E4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {reservationStep === 0 ? (
          <Typography sx={{ fontSize: 20 }} color="primary.main" gutterBottom>
            Enter your email and token
          </Typography>
        ) : reservationStep === 1 ? (
          <Typography sx={{ fontSize: 20 }} color="primary.main" gutterBottom>
            Reservation data
          </Typography>
        ) : reservationStep === 2 ? (
          <Typography sx={{ fontSize: 20 }} color="primary.main" gutterBottom>
            Final step
          </Typography>
        ) : null}
      </Container>
      {reservationStep === 0 ? (
        <form onSubmit={handleUserData}>
          <StyledContainer>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              {...register("userEmail", { required: true })}
            />
            <TextField
              label="Token"
              variant="outlined"
              fullWidth
              required
              {...register("token", { required: true })}
            />
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Button
                size="medium"
                variant="contained"
                color="primary"
                type="submit"
              >
                Next
              </Button>
            </Container>
          </StyledContainer>
        </form>
      ) : reservationStep === 1 ? (
        <form onSubmit={handleNewReservationData}>
          <StyledContainer>
            <Typography
              sx={{ fontSize: 20, fontWeight: "500" }}
              color="primary.main"
              gutterBottom
            >
              Service name:
              {" " + reservation?.service.serviceName}
            </Typography>
            <Typography
              sx={{ fontSize: 20, fontWeight: "500" }}
              color="primary.main"
              gutterBottom
            >
              Date of reservation:
              {" " + dayjs(reservation?.date).format("DD/MM/YY HH:mm")}
            </Typography>
            <Typography
              sx={{ fontSize: 20, fontWeight: "500" }}
              color="primary.main"
              gutterBottom
            >
              Price of reservation:
              {" " + reservation?.price.toFixed(0)} din
            </Typography>
            <FormControl fullWidth>
              <Controller
                name={"date"}
                rules={{ required: true }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={value ?? null}
                      onChange={(event) => {
                        onChange(event);
                      }}
                      slotProps={{
                        textField: {
                          error: error?.type === "validate",
                          helperText:
                            error?.type === "validate"
                              ? "Date is required"
                              : null,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
                control={control}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="status-select-label" required>
                Time slot
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="status-select-label"
                    id="status-select"
                    label="Time Slot"
                    required
                  >
                    {reservation?.service?.availability.map((slot) => (
                      <MenuItem value={slot} key={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name={"timestamp"}
                control={control}
              />
            </FormControl>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={() => setReservationStep(0)}
              >
                Back
              </Button>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={() => cancelReservation()}
              >
                Cancel
              </Button>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                type="submit"
              >
                Next
              </Button>
            </Container>
          </StyledContainer>
        </form>
      ) : reservationStep === 2 ? (
        <StyledContainer>
          <Typography
            sx={{ fontSize: 20, fontWeight: "500" }}
            color="primary.main"
            gutterBottom
          >
            Date of reservation:
            {" " +
              dayjs(getValues("date")).format("DD/MM/YYYY") +
              ", " +
              getValues("timestamp")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              alignItems: "flex-end",
            }}
          >
            <Typography
              sx={{ fontSize: 20, fontWeight: "400" }}
              color="primary.main"
              gutterBottom
            >
              Price of reservation:
              {" " + reservation?.service?.price.toString()} din
            </Typography>

            {checkEarlyBird() ? (
              <Typography
                sx={{ fontSize: 20, fontWeight: "400" }}
                color="primary.main"
                gutterBottom
              >
                -5%
              </Typography>
            ) : null}
            {checkEarlyBird() && (
              <Typography
                sx={{ fontSize: 20, fontWeight: "400" }}
                color="primary.main"
                gutterBottom
              >
                {(reservation?.service?.price * (checkEarlyBird() ? 0.95 : 1))
                  .toFixed(0)
                  .toString()}
              </Typography>
            )}
          </Box>
          <Container
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={() => setReservationStep(1)}
            >
              Back
            </Button>
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={() => finishReservation()}
            >
              Reserve
            </Button>
          </Container>
        </StyledContainer>
      ) : null}
    </Dialog>
  );
};
