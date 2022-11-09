import React from 'react';
import PropTypes from 'prop-types';

function Modal({ setOpenModal }) {
  return (
    <div>
      <div className="modalBackground">
        <div className="modalContainer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Sulje
          </button>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  setOpenModal: PropTypes.any
};

export default Modal;
