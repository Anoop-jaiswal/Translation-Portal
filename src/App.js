import React, { useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import ClientDashboard from "./Pages/ClientDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import Login from "./Pages/Login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authenticatedUser = useSelector(
    (state) => state.user.authenticatedUser
  );

  useEffect(() => {
    if (authenticatedUser?.role) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [authenticatedUser]);

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/client",
      element:
        isAuthenticated && authenticatedUser?.role === "client" ? (
          <ClientDashboard />
        ) : (
          <Navigate to="/login" />
        ),
    },
    {
      path: "/admin",
      element:
        isAuthenticated && authenticatedUser?.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <Navigate to="/login" />
        ),
    },
    {
      path: "*",
      element: <Navigate to="/login" />,
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  );
};

export default App;
