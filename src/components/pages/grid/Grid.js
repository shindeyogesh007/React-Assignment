import React, { useEffect, useState } from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../../redux/slices/userSlice";
import { useHistory } from "react-router-dom";

import classes from "./grid.module.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const Grid = () => {
  const history = useHistory();
  const [rowData, setRowData] = useState([]);
  const loggedInUser = useSelector((state) => {
    return state.user.value;
  });
  const dispatch = useDispatch();
  const [user, setUser] = useState(loggedInUser);
  const remainingTime = useSelector((state) => state.user.remainingTime);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser({ id: userData?.userId, full_name: userData?.username });
    axios.get("https://jsonplaceholder.typicode.com/users").then((response) => {
      const userList = response.data;
      const users = userList.map((x) => {
        return {
          ...x,
          fullAddress: `${x.address.street}, ${x.address.suite}, ${x.address.city}, ${x.address.zipcode}`,
          companyDetails: `Name:${x.company.name},Catch Phrase:${x.company.catchPhrase},bs:${x.company.bs}`,
        };
      });
      setRowData(users);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    dispatch(userActions.removeUser());
    dispatch(userActions.setLoggedIn(false));
    dispatch(userActions.setExpirationDate(""));
    dispatch(userActions.setRemainingTime(""));
    history.push("/");
  };

  return (
    <>
      <div className={classes.header}>
        <div style={{ textAlign: "center" }}>
          logged in as
          <h3 style={{ margin: 0 }}>{user?.full_name}</h3>
        </div>
        <h2>User Listing</h2>
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className={`ag-theme-alpine ${classes.grid}`}>
        <AgGridReact rowData={rowData} pagination={true} paginationPageSize={5}>
          <AgGridColumn field="id" sortable={true} filter={true}></AgGridColumn>
          <AgGridColumn
            field="name"
            sortable={true}
            filter={true}
          ></AgGridColumn>
          <AgGridColumn
            field="username"
            sortable={true}
            filter={true}
          ></AgGridColumn>
          <AgGridColumn
            field="email"
            sortable={true}
            filter={true}
          ></AgGridColumn>
          <AgGridColumn
            field="fullAddress"
            sortable={true}
            filter={true}
          ></AgGridColumn>
          <AgGridColumn
            field="phone"
            sortable={true}
            filter={true}
          ></AgGridColumn>
          <AgGridColumn
            field="website"
            sortable={true}
            filter={true}
          ></AgGridColumn>
          <AgGridColumn
            field="companyDetails"
            sortable={true}
            filter={true}
          ></AgGridColumn>
        </AgGridReact>
      </div>
    </>
  );
};

export default Grid;
