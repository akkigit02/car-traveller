import React, { useState } from 'react';
import style from '../assets/css/tooltip.css';

const Tooltip = ({ children, message, direction = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div className="tooltip-container">
      <div
        className="tooltip-target"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>

      {isVisible && (
        <div className={`tooltip-box tooltip-${direction}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
