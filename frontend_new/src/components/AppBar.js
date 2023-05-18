import React from 'react';
import { BsList, BsSliders } from 'react-icons/bs';

export default function AppBar() {
  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 text-white bg-gray-900">
      <div className="flex-none text-2xl scale-2xl">
        <div className="btn">
          <BsList />
        </div>
      </div>
      <div className="flex-auto">
        <h1>Whisper Task Monitor</h1>
      </div>
      <div className="flex-none">
        <div className="btn">
          <BsSliders />
        </div>
      </div>
    </div>
  );
}
