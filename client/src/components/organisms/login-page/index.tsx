import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Container, TextField, Button, Grid, Typography } from "@mui/material";

import { StyledContainer } from "./login-page.style";

import { useLoginUserMutation } from "../../../store/todoSlice";

interface LoginPageProps {
  setToken: (token: string | null) => void;
}

export const LoginPage: FC<LoginPageProps> = ({ setToken }) => {
  const [error, setError] = useState<string>("");
  const { register, handleSubmit } = useForm<User>();
  const navigate = useNavigate();

  const [handleLoginUser] = useLoginUserMutation();

  const onSubmit: SubmitHandler<User> = (data: User) => {
    handleLoginUser(data)
      .unwrap()
      .then((res) => {
        sessionStorage.setItem("token", res.token);
        setToken(res.token);
        setError("");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError(error.data.message);
      });
  };

  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "50%",
        margin: "auto",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledContainer>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            fullWidth
            required
            {...register("user", { required: true })}
          />
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            fullWidth
            required
            {...register("password", { required: true })}
          />

          <Container sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              size="medium"
              variant="contained"
              color="primary"
              type="submit"
            >
              Login
            </Button>
          </Container>
          {error !== "" && <Typography color="error">{error}</Typography>}
        </StyledContainer>
      </form>
    </Grid>
  );
};
