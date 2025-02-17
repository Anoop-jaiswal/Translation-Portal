import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Card,
  CardContent,
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Redux/Slices/Slice";

const Header = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const defaultProfilePic =
    "https://via.placeholder.com/150/1976d2/ffffff?text=User";

  const stringAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return { children: initials };
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
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
            <TranslateIcon />
            Translation Portal
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Avatar Clickable */}
            <IconButton onClick={handleAvatarClick}>
              <Avatar
                {...stringAvatar(user?.name || "User")}
                src={user?.profilePic || defaultProfilePic}
                sx={{
                  bgcolor: "#FFFFFF", // Gold background for avatar
                  color: "#607D8B",
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Popper
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        transition
        placement="bottom-end"
        sx={{ zIndex: 2 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper elevation={3} sx={{ mt: 1, borderRadius: 2 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <Card sx={{ width: 250, pt: 2, textAlign: "center" }}>
                  <Avatar
                    src={user?.profilePic || defaultProfilePic}
                    {...stringAvatar(user?.name || "User")}
                    sx={{ width: 64, height: 60, margin: "0 auto" }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {user?.name || "User"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user?.email || "user@example.com"}
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      sx={{ mt: 3, borderRadius: 1 }}
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

export default Header;
