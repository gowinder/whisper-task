import { Menu, Popover } from '@headlessui/react';
import React from 'react';
import { BsList, BsSliders } from 'react-icons/bs';

export default function AppBar() {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center bg-app-bar shadow ">
        <div className="flex-none">
          <Popover className="relative">
            <Popover.Button className="btn btn-app">
              <BsList className="btn-app-icon" />
            </Popover.Button>
            <Popover.Panel className="absolute z-10">
              <div className="flex flex-col p-4 rounded-lg shadow hover:ring-1 text-slate-100 bg-base-600">
                <div>
                  <p>d3</p>
                </div>
                <div>
                  <p>b3</p>
                </div>
              </div>
            </Popover.Panel>
          </Popover>
        </div>
        <div className="grow text-center">
          <h1 className="text-3xl text-slate-200">Whisper Task</h1>
        </div>
        <button className="btn btn-app">
          <BsSliders className="btn-app-icon" />
        </button>
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
