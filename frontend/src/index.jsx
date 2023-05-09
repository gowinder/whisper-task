import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Box, Toolbar, IconButton, Typography, AppBar, ThemeProvider, Stack, Dialog, Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import WhisperTaskList from './components/WhisperTaskList';
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { Provider } from 'react-redux';
import store from './store/store';
import { TaskLogs } from './components/TaskLogs';
import App from './App';
import theme from './theme/theme';
import SettingsForm from './components/SettingsForm';


function Index() {

  return (
    <App />
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Index />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
