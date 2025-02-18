import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const initialState = {
  users: loadFromLocalStorage("users") || [],
  authenticatedUser: loadFromLocalStorage("authenticatedUser") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const { email } = action.payload;
      const existingUser = state.users.find((user) => user.email === email);
      if (existingUser) {
        alert("User with this email already exists!");
        return;
      }
      const newUser = { ...action.payload, files: [], translatedFile: [] };
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
      const userIndex = state.users.findIndex((user) => user.email === email);
      if (userIndex !== -1) {
        const fileIndex = state.users[userIndex].files.findIndex(
          (f) => f.id === file.id
        );

        if (fileIndex !== -1) {
          state.users[userIndex].files[fileIndex] = file;
        } else {
          state.users[userIndex].files.push(file);
        }
        saveToLocalStorage("users", state.users);
      }
    },

    deleteFileFromUser: (state, action) => {
      const { email, fileName } = action.payload;
      const userIndex = state.users.findIndex((user) => user.email === email);
      if (userIndex !== -1) {
        state.users[userIndex].files = state.users[userIndex].files.filter(
          (file) => file.name !== fileName
        );

        if (state.authenticatedUser?.email === email) {
          state.authenticatedUser = { ...state.users[userIndex] };
          saveToLocalStorage("authenticatedUser", state.authenticatedUser);
        }
        saveToLocalStorage("users", state.users);
      }
    },

    updateFileStatus: (state, action) => {
      const { email, file } = action.payload;
      const userIndex = state.users.findIndex((user) => user.email === email);
      if (userIndex !== -1) {
        const fileIndex = state.users[userIndex].files.findIndex(
          (f) => f.id === file.id
        );

        if (fileIndex !== -1) {
          state.users[userIndex].files[fileIndex].status = file.status;
          saveToLocalStorage("users", state.users);
        }
      }
    },

    addTranslatedFileToUser: (state, action) => {
      const { email, translatedFile } = action.payload;
      const userIndex = state.users.findIndex((user) => user.email === email);
      if (userIndex !== -1) {
        state.users[userIndex].translatedFile.push(translatedFile);

        if (state.authenticatedUser?.email === email) {
          state.authenticatedUser.translatedFile = [
            ...state.authenticatedUser.translatedFile,
            translatedFile,
          ];
          saveToLocalStorage("authenticatedUser", state.authenticatedUser);
        }
        saveToLocalStorage("users", state.users);
      }
    },

    refreshState: (state) => {
      state.users = loadFromLocalStorage("users") || [];
      state.authenticatedUser =
        loadFromLocalStorage("authenticatedUser") || null;
    },
  },
});

export const {
  registerUser,
  authenticateUser,
  logoutUser,
  addFileToUser,
  deleteFileFromUser,
  updateFileStatus,
  addTranslatedFileToUser,
  refreshState,
} = userSlice.actions;
export default userSlice.reducer;
