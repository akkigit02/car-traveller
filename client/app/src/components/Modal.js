import React from 'react';
import style from '../assets/css/popups.css';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal_overlay" onClick={onClose}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        <div className='d-flex align-items-center justify-content-between border-bottom px-3 py-2'>
          <div className='h4'>{title}</div>
        <button className="modal_close" onClick={onClose}>X</button>
        </div>
        <div className='scroll-body p-3'>
        {children}

        </div>
      </div>
    </div>
  );
};

export default Modal;