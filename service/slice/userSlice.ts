import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'userData',
  initialState: {
    userData: {},
    token : "",
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    setToken : (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {setUser , setToken  } = authSlice.actions;
export default authSlice.reducer;
