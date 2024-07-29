import { configureStore } from '@reduxjs/toolkit';
import storeSlice from './slice/userInfoSlice';

export default configureStore({
  reducer: {
    userInfo: storeSlice,
  },
})