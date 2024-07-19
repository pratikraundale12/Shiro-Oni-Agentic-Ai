import React from 'react';
import PropTypes from 'prop-types';

export const CopyIcon = ({ width = 18, height = 20, color = '#444445' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M4 4V1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H1.007A1.001 1.001 0 0 1 0 19L.003 5c0-.552.45-1 1.006-1H4ZM2.002 6 2 18h10V6H2.002ZM6 4h8v10h2V2H6v2Z"
    />
  </svg>
);

CopyIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
