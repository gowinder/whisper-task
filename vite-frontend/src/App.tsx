import React, { SetStateAction, useState } from 'react';
import reactLogo from './assets/react.svg';
import AppBar from './components/AppBar';
import viteLogo from '/vite.svg';
import './index.css';

function App() {
  const [theme, setTheme] = useState('');

  const handleThemeChange = (newTheme: string) => {
    console.log('App handleThemeChange', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className={`${theme} flex flex-col bg-base`}>
      <AppBar onThemeChange={handleThemeChange} />
    </div>
  );
}

export default App;
