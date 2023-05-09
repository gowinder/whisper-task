import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from '@emotion/react';
import { AppBar, Toolbar, IconButton, Typography, Stack, Button } from '@mui/material';
import React from 'react';
import { Provider } from 'react-redux';
import SettingsForm from './components/SettingsForm';
import { TaskLogs } from './components/TaskLogs';
import WhisperTaskList from './components/WhisperTaskList';
import store from './store/store';
import theme from './theme/theme';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

function App() {
  const [openModal, setOpenModal] = React.useState(false);
  return (
    <Provider store={store}>
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <SettingsForm
            isOpen={openModal}
            onClose={() => {
              setOpenModal(false);
            }}
          />
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Whisper Task
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="setting"
                onClick={() => setOpenModal(true)}
              >
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
  );
}

export default App;
