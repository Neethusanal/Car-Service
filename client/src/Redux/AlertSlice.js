import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: '',
  message: '',
  show: false
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.show = true;
    },
    clearAlert: (state) => {
      state.type = '';
      state.message = '';
      state.show = false;
    }
  }
});

export const { setAlert, clearAlert } = alertSlice.actions;

export default alertSlice.reducer;