import { Menu, Popover } from '@headlessui/react';
import React, { useState } from 'react';
import { BsList, BsGear } from 'react-icons/bs';
import Modal from './Modal';
import SettingsDialog from './SettingsDialog';

export default function AppBar({ onThemeChange }) {
  const [selectedTheme, setSelectedTheme] = useState('');

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setSelectedTheme(newTheme);
    onThemeChange(newTheme);
  };

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col">
      <SettingsDialog showModal={showModal} closeModal={closeModal} />
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
          <button className="btn btn-app" onClick={() => setShowModal(true)}>
            <BsGear className="btn-app-icon" />
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
