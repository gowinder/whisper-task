import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
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
import makeStyles from "@mui/styles";
import apiClient from "@/utils/apiClient";

// const useStyles = makeStyles((theme) => ({
//   root: (props) => ({
//     backgroundColor: props.backgroundColor,
//     color: theme.color,
//   }),
//   accordion: {
//     marginBottom: theme.spacing(1),
//   },
// }));

interface ISchedulerTaskProps {
  tasks: string[];
  fetchTasks: (tasks: string[]) => void;
}

const SchedulerTask: React.FC<ISchedulerTaskProps> = ({
  tasks,
  fetchTasks,
}) => {
  // const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      apiClient.get(`/scan_task_log`).then((response) => {
        const tasks = response.data.tasks.slice(-3).reverse(); // 获取最后三项任务并倒序排列
        fetchTasks(tasks);
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchTasks]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const renderListItem = (task: string, index: number) => {
    if (index < page * 10 || index >= (page + 1) * 10) return null; // 超出当前页的范围不渲染

    const truncatedText = task.length > 30 ? `${task.slice(0, 30)}...` : task; // 如果长度超过 30，截断加入 "..."
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
      <Accordion expanded={expanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={handleExpandClick}
          aria-controls="scheduler-task-list"
        >
          <Typography variant="h5">Scheduler Task</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List disablePadding>
            {tasks && tasks.map((task, index) => renderListItem(task, index))}
          </List>
          {tasks && tasks.length > 10 && (
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
                  Page {page + 1} / {Math.ceil(tasks.length / 10)}
                </Typography>
              </Box>
              <Button
                disabled={page === Math.ceil(tasks.length / 10) - 1}
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

const mapStateToProps = (state: any) => {
  return {
    tasks: state.schedulerTasks,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchTasks: (tasks: string[]) =>
      dispatch(actions.fetchSchedulerTasks(tasks)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerTask);
