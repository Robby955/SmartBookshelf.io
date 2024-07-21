// components/CustomTooltip.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CustomTooltip = ({ id, message, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 p-2 text-sm text-white bg-gray-900 rounded shadow-lg"
          role="tooltip"
          aria-describedby={id}
        >
          {message}
        </div>
      )}
    </div>
  );
};

CustomTooltip.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CustomTooltip;
