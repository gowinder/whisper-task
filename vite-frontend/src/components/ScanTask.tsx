import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ScanTask extends Component {
  render() {
    return (
      <div className="flex flex-col items-center justify-center m-4 ">
        <div className="text-center text-neutral-content bg-neutral w-full rounded-t-lg py-2">
          <span className="badge badge-primary text-lg shadow-md">Scan Task</span>
        </div>
        <div className="flex flex-col bg-base-300 items-center justify-center w-full rounded-b-lg py-2 space-y-2 shadow-lg">
          <div className="card-span-group">
            <span className="card-span-left">Status:</span>
            <span className="card-span-right badge-error">STOPED</span>
          </div>
          <div className="card-span-group">
            <span className="card-span-left">Scaned Files: </span>
            <span className="card-span-right badge-accent">255</span>
          </div>
          <div className="card-span-group">
            <span className="card-span-left">Matched Files: </span>
            <span className="card-span-right badge-accent">11</span>
          </div>
        </div>
      </div>
    );
  }
}