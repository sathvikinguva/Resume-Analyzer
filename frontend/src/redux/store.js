import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import resumeReducer from './slices/resumeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
  },
});

export default store;
