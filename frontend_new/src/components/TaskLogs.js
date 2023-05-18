import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { apiClient } from '../utils/apiClient';
// import { Collapse } from 'react-daisyui';

TaskLogs.propTypes = {
  task_type: PropTypes.string.isRequired,
};

export default function TaskLogs({ task_type }) {
  // console.log('TaskLogs', task_type);

  // const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [fetchStatus, setFetchStatus] = useState('idle');
  const [title, setTitle] = useState('');

  const fetchLogs = useCallback(() => {
    console.log('TaskLogs: fetchLogs', title, task_type, page);
    setFetchStatus('fetching');
    apiClient.get(`/task_log?task_type=${task_type}&page=${page}`).then((response) => {
      console.log('fetchLogs response', task_type, response.data);
      setLogs(response.data.logs);
      setPage(response.data.page);
      setTotalPages(response.data.total_pages);
      setFetchStatus('success');
    });
  }, [page]);

  useEffect(() => {
    console.log('TaskLogs: useEffect', fetchStatus, title, task_type);
    if (task_type === 'scan') {
      setTitle('Scan task logs');
    } else if (task_type === 'scheduler') {
      setTitle('Scheduler task logs');
    }

    if (fetchStatus === 'idle') {
      fetchLogs();
    }

    // const intervalId = setInterval(() => {
    //   fetchLogs();
    // }, 5000);

    // return () => clearInterval(intervalId);
  }, [fetchStatus, title, task_type, fetchLogs]);

  const handlePageChange = (event, newPage) => {
    // event.stopPropagation();
    setPage(newPage);
    setFetchStatus('idle');
    // fetchLogs();
  };

  const renderListItem = (log_text, index) => {
    // console.log('renderListItem', log_text, index);
    return (
      <tr key={index}>
        <td>{index}</td>

        <td>
          <div className="tooltip tooltip-left tooltip-primary" data-tip={log_text}>
            {log_text}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-2 m-1">
      {/* <Collapse tabIndex={0}>
        <Collapse.Title className="text-xl font-medium">Focus me to see content</Collapse.Title>
        <Collapse.Content>{logs && totalPages}</Collapse.Content>
      </Collapse> */}
      <div tabIndex={0} className="shadow collapse-arrow rounded-box collapse">
        <input type="checkbox" className="peer" />
        <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
          {title}
        </div>
        <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
          <div className="p-2 m-2 shadow-xl space-2 rounded-box bg-neutral ">
            <div className="mb-2">
              <table className="">
                <thead>
                  <tr>
                    <th></th>
                    <th>Log</th>
                  </tr>
                </thead>
                <tbody>
                  {logs && logs.map((log_text, index) => renderListItem(log_text, index))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center btn-group">
              <button
                className="btn"
                disabled={page === 0}
                onClick={(e) => handlePageChange(e, page - 1)}>
                {'<'}
              </button>
              <button className="btn">
                Page {page + 1} / {totalPages}
              </button>
              <button
                className="btn"
                disabled={page === totalPages - 1}
                onClick={(e) => handlePageChange(e, page + 1)}>
                {'>'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
