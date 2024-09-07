import React from 'react';
import '../assets/css/popups.css';

const Popup = ({ isOpen, handleClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay1" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
