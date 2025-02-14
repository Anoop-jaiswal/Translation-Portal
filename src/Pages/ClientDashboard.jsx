import React from "react";
import { Typography } from "@mui/material";
import MyFiles from "../Components/LandingPage/ClientLandingPage";
// import FilePresentIcon from "@mui/icons-material/FilePresent";

const ClientDashboard = () => {
  return (
    <div>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1, // Adjust spacing between icon and text
          m: 3,
        }}
      >
        {/* <FilePresentIcon sx={{ fontSize: "inherit", color: "primary.main" }} /> */}
        My Files
      </Typography>

      <MyFiles />
    </div>
  );
};

export default ClientDashboard;
