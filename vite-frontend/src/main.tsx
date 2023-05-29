import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
