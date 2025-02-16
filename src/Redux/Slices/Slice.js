import { createSlice } from "@reduxjs/toolkit";

// Load data from local storage
const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

// Save data to local storage
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const initialState = {
  users: loadFromLocalStorage("users") || [], // Load users from localStorage
  authenticatedUser: loadFromLocalStorage("authenticatedUser") || null, // Load current authenticated user
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const { email } = action.payload;

      // Check if user already exists
      const existingUser = state.users.find((user) => user.email === email);
      if (existingUser) {
        alert("User with this email already exists!");
        return;
      }

      // Add user with an empty files array
      const newUser = { ...action.payload, files: [] };
      state.users.push(newUser);
      saveToLocalStorage("users", state.users);
    },

    authenticateUser: (state, action) => {
      const { email, password } = action.payload;
      const user = state.users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        state.authenticatedUser = { ...user };
        saveToLocalStorage("authenticatedUser", state.authenticatedUser);
      } else {
        alert("Invalid credentials!");
      }
    },

    logoutUser: (state) => {
      state.authenticatedUser = null;
      localStorage.removeItem("authenticatedUser");
    },

    addFileToUser: (state, action) => {
      const { email, file } = action.payload;

      // Find the user by email
      const userIndex = state.users.findIndex((user) => user.email === email);
      if (userIndex !== -1) {
        state.users[userIndex].files.push(file);

        // Update authenticated user if they are the one adding files
        if (state.authenticatedUser?.email === email) {
          state.authenticatedUser = { ...state.users[userIndex] };
          saveToLocalStorage("authenticatedUser", state.authenticatedUser);
        }

        // Save updated users list
        saveToLocalStorage("users", state.users);
      }
    },

    deleteFileFromUser: (state, action) => {
      const { email, fileName } = action.payload;

      // Find the user by email
      const userIndex = state.users.findIndex((user) => user.email === email);
      if (userIndex !== -1) {
        state.users[userIndex].files = state.users[userIndex].files.filter(
          (file) => file.name !== fileName
        );

        // Update authenticated user if they are the one deleting files
        if (state.authenticatedUser?.email === email) {
          state.authenticatedUser = { ...state.users[userIndex] };
          saveToLocalStorage("authenticatedUser", state.authenticatedUser);
        }

        // Save updated users list
        saveToLocalStorage("users", state.users);
      }
    },
  },
});

export const {
  registerUser,
  authenticateUser,
  logoutUser,
  addFileToUser,
  deleteFileFromUser,
} = userSlice.actions;
export default userSlice.reducer;
