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

import { StyledContainer } from "./reservation-modal.style";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import enGB from "dayjs";
import dayjs from "dayjs";

interface ServiceModalProps {
  open: boolean;
  handleModalOpen: (service: Service | null) => void;
  activeService: Service | null;
}

interface UserReservation {
  user: User;
  service: Service;
  date: Date | null;
  timestamp: string;
  emailCheck: string;
  promoCode: string;
  finalPrice: number;
}

export const ServiceModal: FC<ServiceModalProps> = ({
  open,
  handleModalOpen,
  activeService,
}) => {
  const [reservationStep, setReservationStep] = useState<number>(0);
  const [emailCheck, setEmailCheck] = useState<boolean>(false);
  const [categoryDiscount, setCategoryDiscount] = useState<boolean>(false);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState<boolean>(false);
  const [userReservation, setUserReservation] = useState<Reservation | null>(
    null
  );
  const { register, handleSubmit, control, reset, setValue, getValues } =
    useForm<UserReservation>();

  const onClose = (e) => {
    e.preventDefault()
    handleModalOpen(null);
    setReservationStep(0);
    setEmailCheck(false);
    setUserReservation(null);
    reset({
      user: {
        first_name: "",
        last_name: "",
        company: "",
        address1: "",
        address2: "",
        zipCode: "",
        region: "",
        country: "",
        email: "",
      },
      date: null,
      timestamp: "",
      emailCheck: "",
      promoCode: "",
      finalPrice: 0,
    });
  };

  const handleEmailError = () => {
    if (getValues("user.email") !== getValues("emailCheck")) {
      setEmailCheck(true);
    } else setEmailCheck(false);
  };

  const handleUserData = (e: any) => {
    e.preventDefault();
    handleEmailError();
    console.log(getValues("emailCheck"), getValues("user.email"))
    if (getValues("user.email") === getValues("emailCheck")) {
      setReservationStep(1);
      checkReservationCategory();
    }
  };

  const handleDateData = (e: any) => {
    e.preventDefault()
    setReservationStep(2);
    checkPromoCode();
  };

  const checkReservationCategory = () => {
    let body = {
      userEmail: getValues("user.email"),
      category: activeService?.category,
    };
    axios
      .post("http://localhost:5050/api/category", body)
      .then(function (response) {
        let check = response.data;
        setCategoryDiscount(check?.hasCategory);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const checkPromoCode = () => {
    let body = {
      userEmail: getValues("user.email"),
      promoCode: getValues("promoCode"),
    };
    axios
      .post("http://localhost:5050/api/check-promo-code", body)
      .then(function (response) {
        let check = response.data;
        setPromoCodeDiscount(check);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const checkEarlyBird = () => {
    if (activeService !== null && getValues("date") !== null) {
      if (dayjs(getValues("date")).isBefore(dayjs(activeService?.earlyBird))) {
        return true;
      }
    }
    return false;
  };

  const handleReservation = (e: any) => {
    e.preventDefault()
    const date = dayjs(getValues("date"));

    // Assuming getValues("service.availability") returns a time string in the format "HH:mm"
    const time = getValues("service.availability");

    // Combine date and time
    const dateTimeString = `${date.format("YYYY-MM-DD")}T${time}`;

    const mergedDateTime = dayjs(dateTimeString);

    let body = {
      user: getValues("user"),
      service: activeService,
      price:
        activeService?.price *
        (checkEarlyBird() ? 0.95 : 1) *
        (categoryDiscount ? 0.9 : 1) *
        (promoCodeDiscount ? 0.95 : 1),
      date: mergedDateTime,
    };
    axios
      .post("http://localhost:5050/api/reservation", body)
      .then(function (response) {
        let res = response.data;
        setUserReservation(res);
        setReservationStep(3);
      })
      .catch(function (error) {
        console.log(error);
      });
    const deleteBody = {
      promoCode: getValues("promoCode"),
    };
    if (promoCodeDiscount) {
      axios
        .delete("http://localhost:5050/api/promo-code", {
          data: {
            promoCode: getValues("promoCode"),
          },
        })
        .then(function (response) {
          let res = response.data;
          console.log(res.message);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
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
        <Typography sx={{ fontSize: 20 }} color="primary.main" gutterBottom>
          {"Reservation for " + activeService?.serviceName}
        </Typography>
        {reservationStep === 0 ? (
          <Typography sx={{ fontSize: 20 }} color="primary.main" gutterBottom>
            Enter your data
          </Typography>
        ) : reservationStep === 1 ? (
          <Typography sx={{ fontSize: 20 }} color="primary.main" gutterBottom>
            Chose date and time
          </Typography>
        ) : reservationStep === 2 ? (
          <Typography sx={{ fontSize: 20 }} color="primary.main" gutterBottom>
            Final step
          </Typography>
        ) : reservationStep === 3 ? (
          <Typography sx={{ fontSize: 20 }} color="primary.main" gutterBottom>
            Reservation data
          </Typography>
        ) : null}
      </Container>
      {reservationStep === 0 ? (
        <form onSubmit={handleUserData}>
          <StyledContainer>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              required
              {...register("user.first_name")}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              required
              {...register("user.last_name", { required: true })}
            />
            <TextField
              label="Company"
              variant="outlined"
              fullWidth
              {...register("user.company", { required: false })}
            />
            <TextField
              label="Address 1"
              variant="outlined"
              fullWidth
              required
              {...register("user.address1", { required: true })}
            />
            <TextField
              label="Address 2"
              variant="outlined"
              fullWidth
              {...register("user.address2", { required: false })}
            />
            <TextField
              label="Zip Code"
              variant="outlined"
              fullWidth
              required
              {...register("user.zipCode", { required: true })}
            />
            <TextField
              label="Region"
              variant="outlined"
              fullWidth
              required
              {...register("user.region", { required: true })}
            />
            <TextField
              label="Country"
              variant="outlined"
              fullWidth
              required
              {...register("user.country", { required: true })}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              {...register("user.email", { required: true })}
            />
            <TextField
              label="Confirm Email"
              variant="outlined"
              fullWidth
              required
              error={emailCheck}
              helperText={emailCheck && "Email must be the same"}
              {...register("emailCheck", { required: true })}
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
        <form onSubmit={handleDateData}>
          <StyledContainer>
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
                    {activeService?.availability.map((slot) => (
                      <MenuItem value={slot} key={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name={"service.availability"}
                control={control}
              />
            </FormControl>
            <TextField
              label="Promo code"
              variant="outlined"
              fullWidth
              {...register("promoCode")}
            />
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
                type="submit"
              >
                Next
              </Button>
            </Container>
          </StyledContainer>
        </form>
      ) : reservationStep === 2 ? (
        <form onSubmit={handleReservation}>
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
                getValues("service.availability")}
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
                {" " + activeService?.price.toString()} din
              </Typography>
              {promoCodeDiscount ? (
                <Typography
                  sx={{ fontSize: 20, fontWeight: "400" }}
                  color="primary.main"
                  gutterBottom
                >
                  -5%
                </Typography>
              ) : null}
              {categoryDiscount ? (
                <Typography
                  sx={{ fontSize: 20, fontWeight: "400" }}
                  color="primary.main"
                  gutterBottom
                >
                  -10%
                </Typography>
              ) : null}
              {checkEarlyBird() ? (
                <Typography
                  sx={{ fontSize: 20, fontWeight: "400" }}
                  color="primary.main"
                  gutterBottom
                >
                  -5%
                </Typography>
              ) : null}
              {(checkEarlyBird() || categoryDiscount || promoCodeDiscount) && (
                <Typography
                  sx={{ fontSize: 20, fontWeight: "400" }}
                  color="primary.main"
                  gutterBottom
                >
                  {(
                    activeService?.price *
                    (checkEarlyBird() ? 0.95 : 1) *
                    (categoryDiscount ? 0.9 : 1) *
                    (promoCodeDiscount ? 0.95 : 1)
                  )
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
                type="submit"
              >
                Reserve
              </Button>
            </Container>
          </StyledContainer>
        </form>
      ) : reservationStep === 3 ? (
        <form onSubmit={onClose}>
          <StyledContainer>
            <Typography
              sx={{ fontSize: 20, fontWeight: "500" }}
              color="primary.main"
              gutterBottom
            >
              Reservation Token: {" " + userReservation?.token}
            </Typography>
            <Typography
              sx={{ fontSize: 20, fontWeight: "500" }}
              color="primary.main"
              gutterBottom
            >
              New promo code: {" " + userReservation?.promoCode}
            </Typography>

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
                Close
              </Button>
            </Container>
          </StyledContainer>
        </form>
      ) : null}
    </Dialog>
  );
};
