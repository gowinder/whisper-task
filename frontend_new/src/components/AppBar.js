import React from 'react';
import { BsList, BsSliders } from 'react-icons/bs';
import SettingsDialog from './SettingsDialog';

// AppBar.propTypes = {
//   onSettingsClick: PropTypes.func.isRequired,
//   onMenuClick: PropTypes.func.isRequired,
// };

export default function AppBar() {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 m-auto text-white bg-gray-900">
      <div className="dropdown-right dropdown">
        <label tabIndex={0} className="m-1 btn">
          <BsList />
        </label>
        <ul tabIndex={0} className="p-2 shadow dropdown-content menu rounded-box w-80 bg-base-100">
          <li>
            <a>Restart scheduler task</a>
          </li>
          <li>
            <a>Restart scan task</a>
          </li>
        </ul>
      </div>
      <div className="flex-auto">
        <h1>Whisper Task Monitor</h1>
      </div>
      <div className="flex-none">
        <div className="btn" onClick={() => setShowSettings(true)}>
          <BsSliders />
        </div>
      </div>
      {showSettings && (
        <SettingsDialog isShow={showSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
