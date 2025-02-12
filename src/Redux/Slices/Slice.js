import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [], // Array to store multiple users
  authenticatedUser: null, // To store the currently authenticated user
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to add a new user to the users array
    registerUser: (state, action) => {
      state.users.push(action.payload); // Add the new user to the list
    },
    // Action to authenticate the user
    authenticateUser: (state, action) => {
      const { email, password } = action.payload;
      const user = state.users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        state.authenticatedUser = user; // Set the authenticated user
      }
    },
    // Action to log out the user
    logoutUser: (state) => {
      state.authenticatedUser = null; // Clear the authenticated user
    },
  },
});

export const { registerUser, authenticateUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
