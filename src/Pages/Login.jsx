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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("client");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authenticatedUser = useSelector(
    (state) => state.user.authenticatedUser
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSignup = () => {
    dispatch(registerUser({ name, email, password, role }));
    navigate("/login");
  };

  const handleLogin = () => {
    dispatch(authenticateUser({ email, password }));
  };

  useEffect(() => {
    if (authenticatedUser) {
      navigate(authenticatedUser.role === "admin" ? "/admin" : "/client");
    }
  }, [authenticatedUser, navigate]);

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
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Left Section - Product Info */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Translation Portal
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, fontSize: "16px" }}>
            A comprehensive translation portal providing clients with an
            efficient and seamless translation experience. This platform
            includes file management, status tracking, and communication
            features for both clients and admins.
          </Typography>
        </Grid>

        {/* Right Section - Login/Signup Form */}
        <Grid item xs={12} md={6} sx={{ padding: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Login" sx={{ fontSize: "16px", fontWeight: "600" }} />
            <Tab label="Signup" sx={{ fontSize: "16px", fontWeight: "600" }} />
          </Tabs>

          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={12}>
              {activeTab === 0 ? (
                // Login Form
                <Box>
                  <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleLogin}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      fontSize: "16px",
                      fontWeight: "bold",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a67d8, #6b46c1)",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Box>
              ) : (
                // Signup Form
                <Box>
                  <TextField
                    label="Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      label="Role"
                    >
                      <MenuItem value="client">Client</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSignup}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      fontSize: "16px",
                      fontWeight: "bold",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a67d8, #6b46c1)",
                      },
                    }}
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
