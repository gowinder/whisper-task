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
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <Provider store={store}>
  <React.StrictMode>
  <ThemeProvider theme={theme}>

    <App />
    <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogContent>
            <SettingsForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Whisper Task
        </Typography>
        <IconButton edge="start" color="inherit" aria-label="setting" onClick={() => setOpenModal(true)}>
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <Stack sx={{ mx: 1 }} spacing={1}>
    
      <WhisperTaskList />
      <TaskLogs task_type="scheduler" />
      <TaskLogs task_type="scan" />
      {/* <SchedulerTaskLogs /> */}
      {/* <ScanLogs /> */}
    </Stack>
  </ThemeProvider>
  </React.StrictMode>

</Provider>
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
