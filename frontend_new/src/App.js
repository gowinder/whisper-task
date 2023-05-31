import React from 'react';
import TaskLogs from './components/TaskLogs';
import AppBar from './components/AppBar';

function App() {
  return (
    <div className="m-auto App">
      <AppBar />
      <TaskLogs task_type="scan" />
      <TaskLogs task_type="scheduler" />
    </div>
  );
}

export default App;
