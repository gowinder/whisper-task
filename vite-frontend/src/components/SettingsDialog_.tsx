import React, { Component } from 'react';
import { Dialog } from '@headlessui/react';
import ReactModal from 'react-modal';

interface Props {
  showModal: boolean;
  closeModal: () => void;
}

class SettingsDialog extends Component<Props> {
  render() {
    const { showModal, closeModal } = this.props;
    return (
      <ReactModal
        isOpen={showModal}
        contentLabel="Settings"
        className="bg-neutral text-basefront justify-center items-center rounded-md shadow-md">
        <div className="flex flex-col">
          <span>abc</span>
          <span>abc</span>
          <span>abc</span>
          <span>abc</span>
          <span>abc</span>
          <button onClick={closeModal}>Close</button>
        </div>
      </ReactModal>
    );
  }
}

export default SettingsDialog;
