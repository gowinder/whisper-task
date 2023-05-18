import React from 'react';
import TaskLogs from './components/TaskLogs';
import AppBar from './components/AppBar';

function App() {
  return (
    <div className="App">
      <AppBar />
      <TaskLogs task_type="scan" />
      <TaskLogs task_type="scheduler" />
    </div>
  );
}

export default App;
