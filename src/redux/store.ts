
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import complaintsReducer from '../features/complaints/complaintsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
