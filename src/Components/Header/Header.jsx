import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import Sidebar from "../Sidebar/Sidebar";
import { Box } from "@mui/material";
// import TranslateIcon from "@mui/icons-material/Translate";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#1976d2",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
            padding: "0 10px",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* <TranslateIcon /> */}
            Translation Portal
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
            onClick={toggleDrawer(true)}
          >
            {/* <MenuIcon /> */} 'menu'
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* <Sidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} /> */}
    </Box>
  );
};

export default Header;
