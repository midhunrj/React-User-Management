import React from 'react';
import './modal.css';

const Modal = ({ show, handleClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={handleClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
