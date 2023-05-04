import { configureStore } from '@reduxjs/toolkit';
import logSlice from './scanLogsSlice';

export default configureStore({
  reducer: {
    logs: logSlice,
  },
});