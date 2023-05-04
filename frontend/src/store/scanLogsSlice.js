import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from '../utils/apiClient';

export const fetchLogs = createAsyncThunk('logs/fetchLogs', async () => {
  const response = await apiClient.get('/scan_task_log?page=0&count=10');
  console.log("🚀 ~ file: scanLogsSlice.js:7 ~ fetchLogs ~ response:", response)
  return response.data;
});

const scanLogSlice = createSlice({
  name: 'logs',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.scan_log;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
  reducers: undefined
});

export default scanLogSlice.reducer;