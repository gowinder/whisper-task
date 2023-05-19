import React, { useEffect, useState } from 'react';
import { BsXCircle } from 'react-icons/bs';
import PropTypes from 'prop-types';

SettingsDialog.propTypes = {
  isShow: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function SettingsDialog(props) {
  const [isShow, setIsShow] = useState(props.isShow);

  useEffect(() => {
    console.log('SettingsDialog useEffect', props.isShow);
    setIsShow(props.isShow);
  }, []);

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
        <div>
          <p className="text-center">abc</p>
        </div>
      </div>
    </div>
  );
}
