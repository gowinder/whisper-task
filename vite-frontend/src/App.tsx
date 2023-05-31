import React, { SetStateAction, useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import AppBar, { ThemeContext } from './components/AppBar';
import viteLogo from '/vite.svg';
import './index.css';
import { themeChange } from 'theme-change';

function App() {
  const [theme, setTheme] = useState<string>(() => {
    // Read the theme value from local storage, or return an empty string if it doesn't exist
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    // Save the current theme value to local storage whenever it changes
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="flex flex-col" data-theme={theme}>
      <AppBar theme={theme} onChangeTheme={setTheme} />
    </div>
  );
}

export default App;
