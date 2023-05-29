import React, { Component, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface Props {
  showModal: boolean;
  closeModal: () => void;
}

class SettingsDialog extends Component<Props> {
  render() {
    const { showModal, closeModal } = this.props;
    return (
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            return;
          }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-base opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg justify-center items-center font-medium leading-6 text-basefront">
                    Settings
                  </Dialog.Title>
                  <div className="mt-2 text-sm bg-base"></div>
                  <div className="input-group">
                    <span className="mt-4 text-basefront ">Scan Path</span>
                    <input
                      type="text"
                      placeholder="scan path in server"
                      className="w-full mt-4 border rounded-md p-2"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm test-primaryfront
                    hover:opacity-80 hover:duration-200 hover:ease-in-out"
                      onClick={closeModal}>
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
}

export default SettingsDialog;
