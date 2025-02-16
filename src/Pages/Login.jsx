import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  authenticateUser,
  logoutUser,
} from "../Redux/Slices/Slice";
import {
  Grid,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("client");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticatedUser = useSelector(
    (state) => state.user.authenticatedUser
  );

  useEffect(() => {
    if (authenticatedUser) {
      navigate(authenticatedUser.role === "admin" ? "/admin" : "/client");
    }
  }, [authenticatedUser, navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSignup = () => {
    dispatch(registerUser({ name, email, password, role }));
    setSnackbarMessage("Signup successful! You can now log in.");
    setOpenSnackbar(true);

    setName("");
    setEmail("");
    setPassword("");
    setRole("client");

    setActiveTab(0);
  };

  const handleLogin = () => {
    dispatch(authenticateUser({ email, password }));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "92vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 3,
      }}
    >
      <Grid
        container
        sx={{
          width: "80%",
          maxWidth: "900px",
          backgroundColor: "white",
          borderRadius: "12px",
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            padding: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Translation Portal
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} sx={{ padding: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Signup" />
          </Tabs>

          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={12}>
              {activeTab === 0 ? (
                <Box>
                  <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleLogin}
                    sx={{ mt: 2 }}
                  >
                    Login
                  </Button>
                </Box>
              ) : (
                <Box>
                  <TextField
                    label="Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <MenuItem value="client">Client</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSignup}
                    sx={{ mt: 2 }}
                  >
                    Signup
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
