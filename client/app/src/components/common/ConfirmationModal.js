import React from 'react';
import '../../assets/css/popups.css';

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;
  const handleConfirm = (e) => {
    try {
      onConfirm(e)
      onClose()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="popup-overlay1">
      <div className="popup-content">
        <h4>Confirmation</h4>
        <p className='py-3'>{message}</p>
        <div className="modal-actions">
          <button className="cstm-btn-trans me-2" onClick={onClose}>Cancel</button>
          <button className="cstm-btn" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>


  );
}

export default ConfirmationModal;