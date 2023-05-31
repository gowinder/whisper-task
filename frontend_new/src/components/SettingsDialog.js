import React, { useEffect, useState } from 'react';
import { BsXCircle } from 'react-icons/bs';
import PropTypes from 'prop-types';
import { apiClient } from '../utils/apiClient';
import { LANGUAGE_FULL, EXTENSIONS, TASK_TYPE } from '../const';

SettingsDialog.propTypes = {
  isShow: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function SettingsDialog(props) {
  const [isShow, setIsShow] = useState(props.isShow);
  const [settings, setSettings] = useState({});

  async function fetchData() {
    const fetchSettings = await apiClient.get('/settings');
    console.log('SettingsDialog fetchSettings', fetchSettings);
    setSettings(fetchSettings);
  }

  useEffect(() => {
    console.log('SettingsDialog useEffect', props.isShow);
    setIsShow(props.isShow);

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setSettings((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className={`modal ${isShow ? 'modal-open' : ''}`}>
      <div className="w-full modal-box">
        <div className="flex justify-end modal-action">
          <div
            className="btn"
            onClick={() => {
              console.log('SettingsDialog close click');
              props.onClose(false);
            }}>
            <BsXCircle />
          </div>
        </div>
        <div className="flex items-center justify-center p-2">
          <p className="text-xl text-primary">Settings</p>
        </div>
        <div className="">
          <div className="p-2 form-control">
            <div className="input-group">
              <span className="label-text">Root directory</span>
              <input
                type="text"
                name="root_dir"
                value={settings.root_dir}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="p-2 form-control">
            <div className="input-group checkbox">
              <span>Rescan</span>
              <input
                type="checkbox"
                name="rescan"
                checked={settings.rescan}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="p-2 form-control">
            <div className="input-group">
              <span>Scan interval</span>
              <input
                type="range"
                name="scan_interval"
                min="30"
                max={60 * 60 * 24}
                step="1"
                value={settings.scan_interval}
                onChange={handleInputChange}
              />
              <span>{settings.scan_interval} seconds</span>
            </div>
          </div>

          <div className="p-2 form-control">
            <div className="input-group">
              <span>Scheduler interval</span>
              <input
                name="scheduler_interval"
                type="range"
                min="30"
                max="3600"
                step="1"
                value={settings.scheduler_interval}
                onChange={handleInputChange}
              />
              <span>({settings.scheduler_interval} seconds) </span>
            </div>
          </div>

          <div className="p-2 form-control">
            <div className="input-group">
              <span>Language</span>
              <select
                className="select"
                name="language"
                value={settings.language}
                onChange={handleInputChange}>
                {LANGUAGE_FULL.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang ? lang : 'Select a language...'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-2 form-control">
            <div className="input-group">
              <span>Task</span>
              <select
                className="select"
                name="task"
                value={settings.task}
                onChange={handleInputChange}>
                {TASK_TYPE.map((task) => (
                  <option key={task} value={task}>
                    {task.charAt(0).toUpperCase() + task.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
