import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_WHISPER_BACKEND_URL}`,
});

export default apiClient;
