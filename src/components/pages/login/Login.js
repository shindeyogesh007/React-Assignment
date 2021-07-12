import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../hooks/useInput";
import { useHistory } from "react-router-dom";
import { login, userActions } from "../../../redux/slices/userSlice";
import { TextField, Grid, Button } from "@material-ui/core";

import Card from "../../atoms/card/Card";
import "./login.css";

const Login = () => {
  const {
    value: uname,
    valueIsValid: unameIsValid,
    hasError: unameHasError,
    valueChangeHandler: unameChangeHandler,
    inputBlurHandler: unameBlurHandler,
    reset: resetUnameInput,
  } = useInput((value) => value.trim() !== "");

  const {
    value: password,
    valueIsValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value) => value.trim() !== "");

  const dispatch = useDispatch();
  const history = useHistory();

  let formIsValid = false;
  if (unameIsValid && passwordIsValid) {
    formIsValid = true;
  }

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!unameIsValid) {
      return;
    }

    resetUnameInput();
    resetPasswordInput();
    dispatch(login({ uname, password }));
  };

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/secured");
    }
  }, [isLoggedIn]);

  return (
    <form onSubmit={handleLogin}>
      <h2 style={{ textAlign: "center" }}>Login Component</h2>

      <Card className="login">
        <Grid
          container
          justifyContent={"center"}
          alignItems="center"
          direction="column"
          spacing={2}
        >
          <Grid item>
            <TextField
              id="uname"
              name="uname"
              type="text"
              label="User Name"
              variant="outlined"
              size="small"
              value={uname}
              // autoComplete="off"
              onChange={unameChangeHandler}
              onBlur={unameBlurHandler}
              error={unameHasError}
              helperText={unameHasError ? "can't have empty field" : ""}
            />
          </Grid>

          <Grid item>
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              variant="outlined"
              size="small"
              value={password}
              autoComplete="off"
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              error={passwordHasError}
              helperText={passwordHasError ? "can't have empty field" : ""}
            />
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formIsValid}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Card>
    </form>
  );
};

export default Login;
