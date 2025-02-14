import { Button } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../Redux/Slices/Slice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };
  return (
    <div>
      <h1>AdminDashboard</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default AdminDashboard;
