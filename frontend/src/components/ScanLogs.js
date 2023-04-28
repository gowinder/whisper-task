import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
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
import makeStyles from '@mui/styles';
import apiClient from '@/utils/apiClient';
import { GET_SCAN_LOGS } from '@/store/types';
import { AppStore } from '@/store/store';

export function ScanLogs() {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const error = useSelector(selectError);

  useEffect(() => {
    // Fetch data initially
    dispatch(fetchData());

    // Fetch data every 5 seconds
    const intervalId = setInterval(() => {
      dispatch(fetchData());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  handleExpandClick = () => {
    this.setState((expanded) => ({ expanded: !expanded }));
  };

  handlePageChange = (event, newPage) => {
    this.setState(() => ({ page: newPage }));
  };

  renderListItem = (log, index) => {
    const { page } = this.state;
    if (index < page * 10 || index >= (page + 1) * 10) return null; // 超出当前页的范围不渲染

    const truncatedLog = log.length > 30 ? `${log.slice(0, 30)}...` : log; // 如果长度超过 30，截断加入 "..."
    return (
      <Tooltip title={log}>
        <ListItem key={index}>
          <ListItemText primary={truncatedLog} />
        </ListItem>
      </Tooltip>
    );
  };

  const { scanLogs } = this.props;
  const { page } = this.state;
  return (
    <Box>
      <Accordion expanded={this.state.expanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={this.handleExpandClick}
          aria-controls="scan-logs"
        >
          <Typography variant="h8">Scan logs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List disablePadding>
            {scanLogs &&
              scanLogs.map((log, index) => this.renderListItem(log, index))}
          </List>
          {scanLogs && scanLogs.length > 10 && (
            <Box display="flex" justifyContent="center" marginTop={2}>
              <Button
                disabled={page === 0}
                variant="outlined"
                color="primary"
                onClick={(e) => this.handlePageChange(e, page - 1)}
              >
                Previous Page
              </Button>
              <Box marginLeft={2} marginRight={2}>
                <Typography variant="body2">
                  Page {page + 1} / {Math.ceil(scanLogs.length / 10)}
                </Typography>
              </Box>
              <Button
                disabled={page === Math.ceil(scanLogs.length / 10) - 1}
                variant="outlined"
                color="primary"
                onClick={(e) => this.handlePageChange(e, page + 1)}
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

const mapStateToProps = (state: any) => ({ scanLogs: state.logs });
