import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: false,
  reducers: {
    login: (state) => {
      state = true;
      return state;
    },
    logout: (state) => {
      state = false;
      return state;
    },
    rehydrateAuthState: (state, { payload }) => {
      if (payload) {
        state = true;
      }
      return state;
    },
  },
});

export const authActions = authSlice.actions;
