import PropTypes from 'prop-types';
import React from 'react';

export const AIMiniIcon = ({ width = 16, height = 16, color = '#FFFFFF' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="2"
        ry="2"
        fill="none"
        stroke={color}
      />

      <circle cx="12" cy="12" r="3" fill={color} stroke="none" />

      <line x1="8" y1="5" x2="8" y2="2" />
      <line x1="16" y1="5" x2="16" y2="2" />
      <line x1="5" y1="16" x2="2" y2="16" />
      <line x1="5" y1="8" x2="2" y2="8" />
    </svg>
  );
};

AIMiniIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
