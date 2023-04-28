import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ScanLogs } from './components/ScanLogs';
import { Box, Toolbar, IconButton, Typography, AppBar } from '@mui/material';
import WhisperTaskList from './components/WhisperTaskList';
import { MenuIcon, SettingsIcon } from '@mui/icons-material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Whisper Task
        </Typography>
        <IconButton edge="start" color="inherit" aria-label="setting">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <Box sx={{ m: 2 }}>
      <WhisperTaskList />
      <ScanLogs />
    </Box>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
