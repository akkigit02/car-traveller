import { createSlice } from '@reduxjs/toolkit'

export const storeSlice = createSlice({
  name: 'USER_INFO',
  initialState: {},
  reducers: {
    SESSION_INFO: (state, action) => {
      state.userInfo = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { SESSION_INFO } = storeSlice.actions

export default storeSlice.reducer