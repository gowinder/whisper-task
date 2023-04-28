import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const slice = createSlice({
  name: 'scanLogs',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setData, setError } = slice.actions;

// Async action creator using thunk middleware
export const fetchData = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.get(
      `https://${process.env.REACT_APP_WHISPER_BACKEND_URL}/scan_task_logs`,
    );
    dispatch(setData(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Selector functions to get specific values from the state
export const selectLoading = (state) => state.scanLogs.loading;
export const selectData = (state) => state.scanLogs.data;
export const selectError = (state) => state.scanLogs.error;

export default slice.reducer;
