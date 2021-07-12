import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../redux/slices/userSlice";
import "./App.css";

import Login from "../pages/login/Login";
import Grid from "../pages/grid/Grid";
import API from "../../config/API";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isAuthenticated, setAuthenticated] = useState(false);
  const user = useSelector((state) => state.user.value);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData?.access_token || !isLoggedIn) {
      setAuthenticated(false);
      dispatch(userActions.setLoggedIn(false));
      history.push("/");
    } else if (userData.access_token) {
      let expirationDate = new Date(userData.expirationDate);
      dispatch(userActions.setExpirationDate(expirationDate.toLocaleString()));

      let remainingTime = expirationDate.getTime() - new Date().getTime();
      dispatch(userActions.setRemainingTime(remainingTime));
      let remainingTimeSec = Math.round(remainingTime / 1000);
      console.log(remainingTime);
      console.log(remainingTimeSec);

      //logging out after 24hrs
      setTimeout(() => {
        setAuthenticated(false);
        dispatch(userActions.setLoggedIn(false));
        history.push("/");
        localStorage.removeItem("userData");
      }, remainingTime);

      setAuthenticated(true);
      dispatch(userActions.setLoggedIn(true));
      dispatch(
        userActions.addUser({
          id: userData.userId,
          full_name: userData.username,
        })
      );
      history.push("/secured");
    }
  }, []);

  return (
    <Switch>
      <Route path="/secured">
        <Grid />
      </Route>
      <Route path="/" exact>
        <Login />
      </Route>
    </Switch>
  );
}

export default App;
