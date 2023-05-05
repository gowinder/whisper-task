import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Stack,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LoopIcon from "@mui/icons-material/Loop";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import ReplayIcon from "@mui/icons-material/Replay";
import { apiClient } from "../utils/apiClient";

const WhisperTaskItem = ({ task }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(task.progress);

  useEffect(() => {
    const timerId = setInterval(() => {
      apiClient.get(`/whisper_tasks/${task.id}`).then((res) => {
        const updatedTask = res.data;
        setProgress(updatedTask.progress);
      });
    }, 10000);
    return () => clearInterval(timerId);
  }, [task.id]);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      // delete the task from Redux store here

      // then call the API to delete it
      axios.delete(`/whisper_tasks/${task.id}`);
    }, 5000);
  };

  const handleToggleEnable = () => {
    const newEnabledStatus = !task.enabled;
    axios
      .patch(`/whisper_tasks/${task.id}`, {
        enabled: newEnabledStatus,
      })
      .then((res) => {
        // update the task in Redux store here
      });
  };

  const handleCancel = () => {
    axios
      .post(`/whisper_tasks/${task.id}/cancel`)
      .then((res) => {
        // update the task in Redux store here
      });
  };

  const handleRetry = () => {
    axios
      .post(`/whisper_tasks/${task.id}/retry`)
      .then((res) => {
        // update the task in Redux store here
      });
  };

  return (
    <ListItem
      disabled={isDeleting}
      divider={true}
      sx={{
        opacity: isDeleting ? 0 : 1,
        transition: "opacity 1s ease-out",
      }}
    >
      <ListItemIcon>
        {task.status === 0 && <LoopIcon />}
        {task.status === 1 && <DoneIcon />}
        {task.status === -1 && <CloseIcon />}
      </ListItemIcon>
      <Box sx={{ flexGrow: 1 }}>
        <Tooltip title={task.fullpath}>
          <ListItemText primary={`${task.filename}...`} />
        </Tooltip>
        <CircularProgress variant="determinate" value={progress} />
        {task.message && (
          <ListItemText
            color="textSecondary"
            secondary={task.message}
            sx={{ marginTop: 0 }}
          />
        )}
      </Box>
      {(task.status === 0 || task.status === -1) && (
        <IconButton onClick={task.status === 0 ? handleCancel : handleRetry}>
          {task.status === 0 ? <CancelIcon /> : <ReplayIcon />}
        </IconButton>
      )}
      <IconButton onClick={handleToggleEnable}>
        {task.enabled ? <LockIcon /> : <LockOpenIcon />}
      </IconButton>
      {isDeleting && (
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            bgcolor: "grey.200",
            opacity: 0.6,
            zIndex: 1,
          }}
        ></Box>
      )}
    </ListItem>
  );
};

const WhisperTaskList = ({ tasks }) => {
  return (
    <Stack>
      <AppBar position="static" sx={{ mx: 1, my: 1, borderRadius: 1 }}>
        <Toolbar>
          <Typography variant="h8">
            Whisper Task
          </Typography>
        </Toolbar>
      </AppBar>
      <List>
        {tasks &&
          tasks.map((task) => <WhisperTaskItem key={task.id} task={task} />)}
      </List>
    </Stack>
  );
};

const mapStateToProps = (state) => ({
  tasks: state.whisperTasks,
});

export default connect(mapStateToProps)(WhisperTaskList);
