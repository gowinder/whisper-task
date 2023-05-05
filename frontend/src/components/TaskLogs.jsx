import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {apiClient} from "./../utils/apiClient";
import theme from "../theme/theme";

// const useStyles = makeStyles((theme) => ({
//   root: (props) => ({
//     backgroundColor: props.backgroundColor,
//     color: theme.color,
//   }),
//   accordion: {
//     marginBottom: theme.spacing(1),
//   },
// }));

// interface ISchedulerTaskProps {
//   tasks: string[];
//   fetchTasks: (tasks: string[]) => void;
// }

export function TaskLogs(props) {
  // const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [fetchStatus, setLogStatus] = useState("idle");
  const [title, setTitle] = useState("");

  const taskType = props.task_type

  const fetchLogs = useCallback(() => {
    setLogStatus("fetching");
    apiClient.get(`/task_log?task_type=${taskType}&page=${page}`).then((response) => {
      setLogs(response.data.logs);
      setPage(response.data.page);
      setTotalPages(response.data.total_pages);
      setLogStatus("success");
    });
  }, [fetchStatus, title, props.task_type]);


  useEffect(() => {
    console.log("TaskLogs: task_type:", props.task_type)
    // setTaskType(props.task_type)
    if (props.task_type === "scan") {
      setTitle("Scan task logs");
    } else if (props.task_type === "scheduler") {
      setTitle("Scheduler task logs");
    }

    if (fetchStatus === "idle") {
      fetchLogs();
    }

    const intervalId = setInterval(() => {
      fetchLogs();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchStatus, title, props.task_type, fetchLogs]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handlePageChange = (
    event,
    newPage
  ) => {
    setPage(newPage);
  };

  const renderListItem = (task, index) => {
    // if (index < page * 10 || index >= (page + 1) * 10) return null; // 超出当前页的范围不渲染

    // const truncatedText = task.length > 30 ? `${task.slice(0, 30)}...` : task; // 如果长度超过 30，截断加入 "..."
    const truncatedText = task
    return (
      <Tooltip title={task}>
        <ListItem key={index}>
          <ListItemText primary={truncatedText} />
        </ListItem>
      </Tooltip>
    );
  };

  return (
    <Box>
      <Accordion expanded={expanded} sx={{ backgroundColor: theme.palette.primary[200], borderRadius: theme.shape.borderRadius }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={handleExpandClick}
          aria-controls="scheduler-task-list"
        >
          <Typography variant="h5">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {logs && logs.map((task, index) => renderListItem(task, index))}
          </List>
          {logs && totalPages > 1 && (
            <Box display="flex" justifyContent="center" marginTop={2}>
            <Button
              disabled={page === 0}
              variant="outlined"
              color="primary"
              onClick={(e) => handlePageChange(e, page - 1)}
            >
              Previous Page
            </Button>
            <Box marginLeft={2} marginRight={2}>
              <Typography variant="body2">
                Page {page + 1} / {totalPages}
              </Typography>
            </Box>
            <Button
              disabled={page === totalPages - 1}
              variant="outlined"
              color="primary"
              onClick={(e) => handlePageChange(e, page + 1)}
            >
              Next Page
            </Button>
          </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};