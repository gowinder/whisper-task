import { Menu, Popover } from '@headlessui/react';
import React from 'react';
import { BsList, BsSliders } from 'react-icons/bs';

export default function AppBar({ onThemeChange }) {
  const [showSettings, setShowSettings] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState('');

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setSelectedTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center bg-app-bar shadow ">
        <div className="flex-none">
          <Popover className="relative">
            <Popover.Button className="btn btn-app">
              <BsList className="btn-app-icon" />
            </Popover.Button>
            <Popover.Panel className="absolute z-10">
              <div className="flex flex-col p-4 divide-y rounded-md divide-primaryfront shadow hover:ring-1 text-slate-100 bg-neutral">
                <ul>
                  <li>
                    <p>abc</p>
                  </li>
                  <li>
                    <p>Stop all whisper tasks</p>
                  </li>
                </ul>
              </div>
            </Popover.Panel>
          </Popover>
        </div>
        <div className="grow text-center">
          <h1 className="text-3xl text-slate-200">Whisper Task</h1>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <label className="text-basefront">Theme</label>
          <select
            className="rounded-md bg-primary shadow-md text-primaryfront"
            value={selectedTheme}
            onChange={handleThemeChange}>
            <option value="">default</option>
            <option value="theme-green">green</option>
            <option value="theme-purple">purple</option>
          </select>
          <button className="btn btn-app">
            <BsSliders className="btn-app-icon" />
          </button>
        </div>
      </div>
      <div>
        <span>abc</span>
      </div>
      <div>
        <span>abc</span>
      </div>
    </div>
  );
}
