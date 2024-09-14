import React from 'react';
import style from '../assets/css/popups.css';

const Modal = ({ isOpen, onClose, children, title, width }) => {
  if (!isOpen) return null;

  return (
    <div className="modal_overlay">
      <div className={`modal_content ${width}`}>
        <div className="d-flex align-items-center justify-content-between border-bottom px-3 py-2">
          <div className="h4">{title}</div>
          <button className="modal_close" onClick={onClose}>X</button>
        </div>
        <div className="p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
