import React, { Component, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface Props {
  showModal: boolean;
  closeModal: () => void;
}

class SettingsDialog extends Component<Props> {
  render() {
    const { showModal, closeModal } = this.props;
    console.log('SettingsDialogD, showModal', showModal);
    return (
      <div className={`modal ${showModal ? 'modal-open' : ''}`}>
        <div className="modal-box flex flex-col">
          <h3 className="font-bold text-lg">Settings</h3>
          <div className="flex flex-row p-2 rounded-md hover:bg-primary hover:bg-opacity-20 hover:rounded-md hover:duration-200 hover:ease-in-out">
            <input type="text" placeholder="Type here" className="input w-full max-w-xs" />
          </div>
          <div className="flex flex-row p-2 rounded-md hover:bg-primary hover:bg-opacity-20 hover:rounded-md hover:duration-200 hover:ease-in-out">
            <input type="text" placeholder="Type here" className="input w-full max-w-xs" />
          </div>

          <div className="modal-action">
            <label htmlFor="my-modal" className="btn" onClick={closeModal}>
              Save!
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsDialog;
