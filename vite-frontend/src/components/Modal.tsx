import React, { Component } from 'react';

interface Props {
  showModal: boolean;
  closeModal: () => void;
}

class Modal extends Component<Props> {
  render() {
    const { showModal, closeModal } = this.props;

    return (
      <>
        {/* 背景遮罩层 */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-500 bg-opacity-75">
            {/* 对话框 */}
            <div
              className={`modal ${
                showModal ? 'open' : ''
              } relative w-full max-w-md p-8 mx-auto my-6 bg-neutral text-basefront rounded-lg shadow-md`}
              onClick={(e) => e.stopPropagation()}>
              {/* 关闭按钮 */}
              <button
                className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
                onClick={closeModal}>
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <title>Close</title>
                  <path d="M18.2929 5.29289C18.6834 4.90237 19.3166 4.90237 19.7071 5.29289C20.0976 5.68342 20.0976 6.31658 19.7071 6.70711L13.4142 13L19.7071 19.2929C20.0976 19.6834 20.0976 20.3166 19.7071 20.7071C19.3166 21.0976 18.6834 21.0976 18.2929 20.7071L12 14.4142L5.70711 20.7071C5.31658 21.0976 4.68342 21.0976 4.29289 20.7071C3.90237 20.3166 3.90237 19.6834 4.29289 19.2929L10.5858 13L4.29289 6.70711C3.90237 6.31658 3.90237 5.68342 4.29289 5.29289C4.68342 4.90237 5.31658 4.90237 5.70711 5.29289L12 11.5858L18.2929 5.29289Z" />
                </svg>
              </button>

              {/* 对话框内容 */}
              <div className="mt-4">{this.props.children}</div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Modal;
