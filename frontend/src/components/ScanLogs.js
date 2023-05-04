import React, { Component, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchLogs } from '../store/scanLogsSlice';

export function ScanLogs() {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.logs.items);
  const logStatus = useSelector((state) => state.logs.status);
  const error = useSelector((state) => state.logs.error);
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (logStatus === 'idle') {
      dispatch(fetchLogs());
    }

    // Fetch data every 5 seconds
    const intervalId = setInterval(() => {
      dispatch(fetchLogs());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [logStatus, dispatch]);

  const handleExpandClick = () => {
    setExpanded(!expanded)
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  };

  const renderListItem = (log, index) => {
    if (index < page * 10 || index >= (page + 1) * 10) return null; // 超出当前页的范围不渲染

    // const truncatedLog = log.length > 30 ? `${log.slice(0, 30)}...` : log; // 如果长度超过 30，截断加入 "..."
    const truncatedLog = log;
    return (
      <Tooltip title={log}>
        <ListItem key={index}>
          <ListItemText primary={truncatedLog} />
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
          aria-controls="scan-logs"
        >
          <Typography variant="h8">Scan logs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List disablePadding>
            {logs &&
              logs.map((log, index) => renderListItem(log, index))
              }
          </List>
          {logs && logs.length > 10 && (
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
                  Page {page + 1} / {Math.ceil(logs.length / 10)}
                </Typography>
              </Box>
              <Button
                disabled={page === Math.ceil(logs.length / 10) - 1}
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
}
