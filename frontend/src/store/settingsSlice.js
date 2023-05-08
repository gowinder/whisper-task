import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../utils/apiClient';

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async () => {
  const response = await apiClient.get('/settings');
  console.log("🚀 ~ file: settingsSlice.js:8 ~ fetchSettings ~ data:", response.data)
  return response.data;
});

export const updateSettings = createAsyncThunk('settings/updateSettings', async (data) => {
  const response = await apiClient.post('/settings', {values: JSON.stringify(data)});
  return response.data;
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    status: 'idle',
    data: {},
    error: null,
  },
  reducers: {
    setSettingsData: (state, action) => {
      // console.log("🚀 ~ file: settingsSlice.js:25 ~ action.payload:", action.payload)
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = JSON.parse(action.payload.values);
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = JSON.parse(action.payload.values);
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSettingsData } = settingsSlice.actions;

export default settingsSlice.reducer;
