import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Redux/Slices/Slice";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Typography, Drawer } from "@mui/material";

const Sidebar = ({ isDrawerOpen, toggleDrawer }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const drawerContent = (
    <Box
      sx={{
        width: { xs: 250, sm: 300, lg: 260 },
        backgroundColor: "#fafafa",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          pl: 5,
          backgroundColor: "#1976d2",
          color: "white",
        }}
      >
        <Typography variant="h6">Menu</Typography>
        <IconButton
          color="inherit"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <List>
          <ListItem button onClick={toggleDrawer(false)}>
            <HomeIcon sx={{ mr: 2 }} />
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={toggleDrawer(false)}>
            <PersonIcon sx={{ mr: 2 }} />
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={toggleDrawer(false)}>
            <SettingsIcon sx={{ mr: 2 }} />
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              toggleDrawer(false);
              logout();
            }}
          >
            <ExitToAppIcon sx={{ mr: 2 }} />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ p: 2, color: "black", mt: "auto" }}>
        <Typography variant="body2" align="center">
          © 2025 My App
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
