import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import logSlice from './scanLogsSlice';
import settingsSlice from './settingsSlice';
import { composeWithDevTools } from '@redux-devtools/extension';

const store = configureStore({
  reducer: {
    logs: logSlice,
    settings: settingsSlice,
  },
});

export default store;