import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from '../utils/apiClient';

export const fetchLogs = createAsyncThunk('logs/fetchLogs', async (page, { getState }) => {
  const response = await apiClient.get(`/scan_task_log?page=${page}&count=10`);
  console.log("🚀 ~ file: scanLogsSlice.js:7 ~ fetchLogs ~ response:", response)
  return response.data;
});

const scanLogSlice = createSlice({
  name: 'logs',
  initialState: {
    items: [],
    page: 0,
    total_pages: 0,
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
        state.page = action.payload.page;
        state.total_pages = action.payload.total_pages;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
  reducers: undefined
});

export default scanLogSlice.reducer;