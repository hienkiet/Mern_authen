import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLogin: false,
  },
  reducers: {
    authLogin: (state, action) => {
      state.isLogin = action.payload.isLogin;
    },
    logOut: (state, action) => {
      state.isLogin = action.payload.isLogin;
    },
  },
});

export const { authLogin, logOut } = userSlice.actions;
export default userSlice.reducer;
