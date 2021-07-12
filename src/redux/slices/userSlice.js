import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../config/API";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    value: null,
    isLoggedIn: false,
    expirationDate: "",
    remainingTime: "",
  },
  reducers: {
    addUser: (state, action) => {
      state.value = action.payload;
    },
    removeUser: (state, action) => {
      state.value = null;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setExpirationDate: (state, action) => {
      state.expirationDate = action.payload;
    },
    setRemainingTime: (state, action) => {
      state.remainingTime = action.payload;
    },
  },
});

//Action creater thunk

export const login = (credentials) => {
  return async (dispatch) => {
    API.post("", {
      client_id: "bitsclient",
      client_secret: "bitspass",
      grant_type: "password",
      application: "portal",
      username: credentials.uname,
      password: credentials.password,
    })
      .then((response) => {
        const { user, access_token, success, refresh_token } = response.data;
        if (success) {
          dispatch(userActions.setLoggedIn(true));
          dispatch(userActions.addUser(user));

          let expirationDate = new Date(new Date().getTime() + 86400 * 1000);
          dispatch(
            userActions.setExpirationDate(expirationDate.toLocaleString())
          );

          localStorage.setItem(
            "userData",
            JSON.stringify({
              userId: user.id,
              username: user.full_name,
              access_token,
              refresh_token,
              expirationDate: expirationDate.toLocaleString(),
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Invalid Username or Password");
      });
  };
};

export const userActions = UserSlice.actions;
export default UserSlice;
