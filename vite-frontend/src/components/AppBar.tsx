import { Menu, Popover } from '@headlessui/react';
import React from 'react';
import { BsList, BsSliders } from 'react-icons/bs';

export default function AppBar() {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <div className="flex-none">
          <Popover className="relative">
            <Popover.Button>
              <BsList className="fill-slate-100" />
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
        <div className="flex-none rounded shadow hover:bg-primary-200 hover:ring-1 hover:ring-primary-500 ease-in-out duration-300">
          <BsSliders className="fill-slate-100 hover:fill-primary-500 ease-in-out duration-300 w-8 h-8" />
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
