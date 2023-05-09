import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
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
  const logItems = useSelector((state) => state.logs.items);
  const page = useSelector((state) => state.logs.page);
  const totalPages = useSelector((state) => state.logs.total_pages);
  const fetchStatus = useSelector((state) => state.logs.status);
  const error = useSelector((state) => state.logs.error);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchLogs(page));
    }

    // Fetch data every 5 seconds
    // const intervalId = setInterval(() => {
    //   dispatch(fetchLogs(page));
    // }, 5000);

    // return () => clearInterval(intervalId);
  }, [fetchStatus, page, dispatch]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handlePageChange = (event, newPage) => {
    dispatch(fetchLogs(newPage));
  };

  const renderListItem = (log, index) => {
    // if (index < page * 10 || index >= (page + 1) * 10) return null; // 超出当前页的范围不渲染

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
            {logItems &&
              logItems['scan'] &&
              logItems['scan'].map((log, index) => renderListItem(log, index))}
          </List>
          {totalPages > 1 && (
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
}
