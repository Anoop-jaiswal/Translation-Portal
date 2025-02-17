import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, authenticateUser } from "../Redux/Slices/Slice";
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
  const [errors, setErrors] = useState({});
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    let newErrors = {};
    if (activeTab === 1 && !name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (!validatePassword(password))
      newErrors.password =
        "Password must be 8+ characters, include uppercase, lowercase, number, and special character";

    if (activeTab === 1 && !role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validateForm()) return;

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
    if (!validateForm()) return;
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
            padding: 6,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px 0 0 12px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Translation Portal
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 3, maxWidth: "85%", lineHeight: 1.6 }}
          >
            Comprehensive translation portal that provides clients with an
            efficient and seamless translation service experience. This platform
            will include functionalities for both clients and admin users,
            focusing on file management, status tracking, and communication.
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
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password}
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
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      error={!!errors.role}
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
